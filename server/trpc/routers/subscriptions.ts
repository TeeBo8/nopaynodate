import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../index";
import { users } from "@/server/db/schema";
import { stripe } from "@/server/stripe/client";
import { siteUrl } from "@/lib/site";

export const subscriptionsRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
    });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    // Vérifier si déjà abonné
    if (user.premiumUntil && new Date(user.premiumUntil) > new Date()) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Vous êtes déjà abonné premium",
      });
    }

    // Créer ou récupérer le customer Stripe
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await ctx.db
        .update(users)
        .set({ stripeCustomerId: customerId, updatedAt: new Date() })
        .where(eq(users.id, user.id));
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PREMIUM_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/settings?premium=success`,
      cancel_url: `${siteUrl}/settings`,
      metadata: { userId: user.id },
    });

    return { url: session.url };
  }),

  createPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
    });
    if (!user?.stripeCustomerId) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Aucun abonnement actif" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${siteUrl}/settings`,
    });

    return { url: session.url };
  }),

  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
    });
    const isPremium = user?.premiumUntil
      ? new Date(user.premiumUntil) > new Date()
      : false;
    return { isPremium, premiumUntil: user?.premiumUntil ?? null };
  }),
});
