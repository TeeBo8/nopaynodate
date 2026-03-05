import { z } from "zod";
import { eq, and, inArray, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../index";
import { dateRequests, deposits, users, profiles } from "@/server/db/schema";
import { stripe } from "@/server/stripe/client";
import { generateId } from "@/lib/utils";
import { sendEmail } from "@/server/emails";
import { MatchAccepteHommeEmail } from "@/server/emails/templates/match-accepte-homme";
import { VirementRecuFemmeEmail } from "@/server/emails/templates/virement-recu-femme";

export const requestsRouter = createTRPCRouter({
  send: protectedProcedure
    .input(z.object({ targetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const requester = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });
      if (requester?.gender !== "man") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Seuls les hommes peuvent envoyer des demandes",
        });
      }

      const targetProfile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.userId, input.targetId),
      });
      if (!targetProfile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Profil introuvable" });
      }

      // Renvoyer la demande existante si déjà active
      const existing = await ctx.db.query.dateRequests.findFirst({
        where: and(
          eq(dateRequests.requesterId, ctx.session.user.id),
          eq(dateRequests.targetId, input.targetId),
          inArray(dateRequests.status, ["pending", "paid", "accepted"])
        ),
      });
      if (existing) return { id: existing.id };

      const id = generateId();
      await ctx.db.insert(dateRequests).values({
        id,
        requesterId: ctx.session.user.id,
        targetId: input.targetId,
        status: "pending",
      });

      return { id };
    }),

  myRequests: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
    });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    if (user.gender === "man") {
      return ctx.db.query.dateRequests.findMany({
        where: eq(dateRequests.requesterId, ctx.session.user.id),
        with: {
          target: { with: { profile: true } },
          deposit: true,
        },
        orderBy: [desc(dateRequests.createdAt)],
      });
    } else {
      return ctx.db.query.dateRequests.findMany({
        where: eq(dateRequests.targetId, ctx.session.user.id),
        with: {
          requester: { with: { profile: true } },
          deposit: true,
        },
        orderBy: [desc(dateRequests.createdAt)],
      });
    }
  }),

  accept: protectedProcedure
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.dateRequests.findFirst({
        where: eq(dateRequests.id, input.requestId),
      });
      if (!request || request.targetId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (request.status !== "paid") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Le dépôt n'a pas encore été reçu",
        });
      }
      await ctx.db
        .update(dateRequests)
        .set({ status: "accepted", updatedAt: new Date() })
        .where(eq(dateRequests.id, input.requestId));

      // Email à l'homme : son match est accepté
      const requesterUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, request.requesterId),
      });
      const targetUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });
      if (requesterUser && targetUser) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
        await sendEmail({
          to: requesterUser.email,
          subject: `${targetUser.name} a accepté votre demande — le chat est ouvert !`,
          react: MatchAccepteHommeEmail({
            manName: requesterUser.name,
            womanName: targetUser.name,
            chatUrl: `${appUrl}/chat/${request.id}`,
          }),
        });
      }

      return { success: true };
    }),

  reject: protectedProcedure
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.dateRequests.findFirst({
        where: eq(dateRequests.id, input.requestId),
        with: { deposit: true },
      });
      if (!request || request.targetId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (!["paid", "accepted"].includes(request.status)) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      if (request.deposit?.stripePaymentIntentId) {
        await stripe.refunds.create({
          payment_intent: request.deposit.stripePaymentIntentId,
        });
        await ctx.db
          .update(deposits)
          .set({ status: "refunded", refundedAt: new Date() })
          .where(eq(deposits.dateRequestId, request.id));
      }

      await ctx.db
        .update(dateRequests)
        .set({ status: "rejected", updatedAt: new Date() })
        .where(eq(dateRequests.id, input.requestId));

      return { success: true };
    }),

  confirm: protectedProcedure
    .input(z.object({ requestId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.dateRequests.findFirst({
        where: eq(dateRequests.id, input.requestId),
        with: { deposit: true },
      });
      if (!request) throw new TRPCError({ code: "NOT_FOUND" });

      const isRequester = request.requesterId === ctx.session.user.id;
      const isTarget = request.targetId === ctx.session.user.id;
      if (!isRequester && !isTarget) throw new TRPCError({ code: "FORBIDDEN" });
      if (request.status !== "accepted") throw new TRPCError({ code: "BAD_REQUEST" });

      const updateData = isRequester
        ? { requesterConfirmed: true as const, updatedAt: new Date() }
        : { targetConfirmed: true as const, updatedAt: new Date() };

      await ctx.db
        .update(dateRequests)
        .set(updateData)
        .where(eq(dateRequests.id, input.requestId));

      // Si les deux ont confirmé → libérer les fonds
      const bothConfirmed = isRequester ? request.targetConfirmed : request.requesterConfirmed;
      if (bothConfirmed && request.deposit) {
        const targetUser = await ctx.db.query.users.findFirst({
          where: eq(users.id, request.targetId),
        });
        if (targetUser?.stripeAccountId && request.deposit.stripePaymentIntentId) {
          const pi = await stripe.paymentIntents.retrieve(
            request.deposit.stripePaymentIntentId
          );
          const chargeId =
            typeof pi.latest_charge === "string"
              ? pi.latest_charge
              : pi.latest_charge?.id;
          if (chargeId) {
            const transfer = await stripe.transfers.create({
              amount: request.deposit.netAmount,
              currency: "usd",
              destination: targetUser.stripeAccountId,
              source_transaction: chargeId,
            });
            await ctx.db
              .update(deposits)
              .set({
                status: "released",
                stripeTransferId: transfer.id,
                releasedAt: new Date(),
              })
              .where(eq(deposits.id, request.deposit.id));
            await ctx.db
              .update(dateRequests)
              .set({ status: "completed", updatedAt: new Date() })
              .where(eq(dateRequests.id, request.id));

            // Email femme : virement reçu
            const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
            await sendEmail({
              to: targetUser.email,
              subject: `Virement de $${(request.deposit.netAmount / 100).toFixed(2)} reçu`,
              react: VirementRecuFemmeEmail({
                womanName: targetUser.name,
                netAmount: request.deposit.netAmount,
                dashboardUrl: `${appUrl}/dashboard`,
              }),
            });
          }
        }
      }

      return { success: true };
    }),
});
