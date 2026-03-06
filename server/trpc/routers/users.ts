import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../index";
import { users, reports, subscriptions } from "@/server/db/schema";
import { stripe } from "@/server/stripe/client";
import { TRPCError } from "@trpc/server";

export const usersRouter = createTRPCRouter({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, ctx.session.user.id))
      .limit(1);
    return user[0] ?? null;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        bio: z.string().max(500).optional(),
        city: z.string().max(100).optional(),
        birthdate: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(users.id, ctx.session.user.id));
    }),

  reportUser: protectedProcedure
    .input(
      z.object({
        reportedUserId: z.string(),
        reason: z.enum(["spam", "fake_profile", "inappropriate", "other"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.reportedUserId === ctx.session.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Impossible de se signaler soi-même" });
      }
      const existing = await ctx.db
        .select({ id: reports.id })
        .from(reports)
        .where(
          and(
            eq(reports.reporterId, ctx.session.user.id),
            eq(reports.reportedUserId, input.reportedUserId)
          )
        )
        .limit(1);
      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Vous avez déjà signalé ce profil" });
      }
      const id = crypto.randomUUID();
      await ctx.db.insert(reports).values({
        id,
        reporterId: ctx.session.user.id,
        reportedUserId: input.reportedUserId,
        reason: input.reason,
      });
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Annuler l'abonnement Stripe si actif
    const sub = await ctx.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    if (sub[0]?.stripeSubscriptionId) {
      try {
        await stripe.subscriptions.cancel(sub[0].stripeSubscriptionId);
      } catch {
        // Si déjà annulé côté Stripe, on continue
      }
    }

    // Supprimer l'utilisateur (cascade supprime tout le reste)
    await ctx.db.delete(users).where(eq(users.id, userId));
  }),
});
