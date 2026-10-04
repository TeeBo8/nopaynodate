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
import { siteUrl } from "@/lib/site";

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
          message: "Only men can send requests",
        });
      }

      const targetUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, input.targetId),
      });
      if (!targetUser || targetUser.gender !== "woman") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Invalid target" });
      }

      // Démo : une demande ne peut viser que la femme du même bac à sable.
      // Les profils de décor n'ont personne derrière eux pour répondre.
      if (
        ctx.isDemo &&
        (!requester.demoSandboxId || targetUser.demoSandboxId !== requester.demoSandboxId)
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "In the demo, send your request to Léa: she is the account you can switch to.",
        });
      }

      const targetProfile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.userId, input.targetId),
      });
      if (!targetProfile) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Profile not found" });
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
          message: "The deposit has not been received yet",
        });
      }

      // Vérifier que la femme a bien configuré son compte Stripe Express
      const currentUser = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
      });
      if (!currentUser?.stripeAccountId) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "You need to set up your Stripe Express account before accepting a request.",
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
        const appUrl = siteUrl;
        await sendEmail({
          to: requesterUser.email,
          subject: `${targetUser.name} accepted your request`,
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

      // Si l'autre a déjà confirmé → libérer les fonds.
      // Le versement Stripe part AVANT toute écriture en base : s'il échoue, rien n'est
      // enregistré et la confirmation peut être relancée (avant, la demande restait bloquée).
      const bothConfirmed = isRequester ? request.targetConfirmed : request.requesterConfirmed;
      const deposit = bothConfirmed ? request.deposit : null;
      const targetUser = deposit
        ? await ctx.db.query.users.findFirst({ where: eq(users.id, request.targetId) })
        : null;

      let released = false;
      let stripeTransferId: string | null = null;
      if (deposit && ctx.isDemo) {
        // Démo : aucun compte Connect réel, le versement est simulé
        released = true;
      } else if (deposit && targetUser?.stripeAccountId && deposit.stripePaymentIntentId) {
        const pi = await stripe.paymentIntents.retrieve(deposit.stripePaymentIntentId);
        const chargeId =
          typeof pi.latest_charge === "string" ? pi.latest_charge : pi.latest_charge?.id;
        if (chargeId) {
          const transfer = await stripe.transfers.create(
            {
              amount: deposit.netAmount,
              currency: "usd",
              destination: targetUser.stripeAccountId,
              source_transaction: chargeId,
            },
            // Une relance après une erreur en base ne crée pas un second versement
            { idempotencyKey: `release-${deposit.id}` }
          );
          released = true;
          stripeTransferId = transfer.id;
        }
      }

      await ctx.db
        .update(dateRequests)
        .set(updateData)
        .where(eq(dateRequests.id, input.requestId));

      if (released && deposit) {
        await ctx.db
          .update(deposits)
          .set({ status: "released", stripeTransferId, releasedAt: new Date() })
          .where(eq(deposits.id, deposit.id));
        await ctx.db
          .update(dateRequests)
          .set({ status: "completed", updatedAt: new Date() })
          .where(eq(dateRequests.id, request.id));

        // Email femme : virement reçu
        if (targetUser) {
          await sendEmail({
            to: targetUser.email,
            subject: `Transfer of $${(deposit.netAmount / 100).toFixed(2)} received`,
            react: VirementRecuFemmeEmail({
              womanName: targetUser.name,
              netAmount: deposit.netAmount,
              dashboardUrl: `${siteUrl}/dashboard`,
            }),
          });
        }
      }

      return { success: true };
    }),
});
