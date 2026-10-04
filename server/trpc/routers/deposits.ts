import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../index";
import { dateRequests, deposits, users } from "@/server/db/schema";
import { stripe } from "@/server/stripe/client";
import { generateId } from "@/lib/utils";
import { siteUrl } from "@/lib/site";

export const depositsRouter = createTRPCRouter({
  createPaymentIntent: protectedProcedure
    .input(z.object({ dateRequestId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.dateRequests.findFirst({
        where: eq(dateRequests.id, input.dateRequestId),
        with: {
          target: { with: { profile: true } },
        },
      });

      if (!request || request.requesterId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      if (request.status !== "pending") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cette demande n'est plus en attente de paiement",
        });
      }

      // Vérifier si un deposit existe déjà (gère le double-rendu StrictMode)
      const existingDeposit = await ctx.db.query.deposits.findFirst({
        where: eq(deposits.dateRequestId, input.dateRequestId),
      });
      if (existingDeposit) {
        const pi = await stripe.paymentIntents.retrieve(
          existingDeposit.stripePaymentIntentId
        );
        return { clientSecret: pi.client_secret };
      }

      const depositAmount = request.target.profile?.depositAmount ?? 5000;
      const commission = Math.round(depositAmount * 0.1);
      const netAmount = depositAmount - commission;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: depositAmount,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
        metadata: {
          dateRequestId: request.id,
          requesterId: ctx.session.user.id,
          targetId: request.targetId,
        },
      });

      try {
        await ctx.db.insert(deposits).values({
          id: generateId(),
          dateRequestId: request.id,
          amount: depositAmount,
          commission,
          netAmount,
          stripePaymentIntentId: paymentIntent.id,
          status: "pending",
        });
      } catch {
        // Race condition : un autre appel a déjà inséré → annuler ce PI et renvoyer l'existant
        await stripe.paymentIntents.cancel(paymentIntent.id);
        const deposit = await ctx.db.query.deposits.findFirst({
          where: eq(deposits.dateRequestId, input.dateRequestId),
        });
        if (deposit) {
          const pi = await stripe.paymentIntents.retrieve(deposit.stripePaymentIntentId);
          return { clientSecret: pi.client_secret };
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return { clientSecret: paymentIntent.client_secret };
    }),

  createConnectedAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
    });
    if (!user || user.gender !== "woman") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    let accountId = user.stripeAccountId;
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "US",
        email: user.email,
        capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      });
      accountId = account.id;
      await ctx.db
        .update(users)
        .set({ stripeAccountId: accountId, updatedAt: new Date() })
        .where(eq(users.id, ctx.session.user.id));
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${siteUrl}/payments/onboarding`,
      return_url: `${siteUrl}/payments/onboarding?success=1`,
      type: "account_onboarding",
    });

    return { url: accountLink.url };
  }),

  getByRequestId: protectedProcedure
    .input(z.object({ dateRequestId: z.string() }))
    .query(async ({ ctx, input }) => {
      const request = await ctx.db.query.dateRequests.findFirst({
        where: eq(dateRequests.id, input.dateRequestId),
      });
      if (
        !request ||
        (request.requesterId !== ctx.session.user.id &&
          request.targetId !== ctx.session.user.id)
      ) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return ctx.db.query.deposits.findFirst({
        where: eq(deposits.dateRequestId, input.dateRequestId),
      });
    }),
});
