import { z } from "zod";
import { eq, and, or, inArray } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../index";
import { users, reports, subscriptions, dateRequests } from "@/server/db/schema";
import { stripe } from "@/server/stripe/client";
import { TRPCError } from "@trpc/server";

// Date au format AAAA-MM-JJ, réelle, pour une personne de 18 à 120 ans
function isAdultBirthdate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const birth = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(birth.getTime()) || birth.toISOString().slice(0, 10) !== value) return false;
  const now = new Date();
  let age = now.getUTCFullYear() - birth.getUTCFullYear();
  const beforeBirthday =
    now.getUTCMonth() < birth.getUTCMonth() ||
    (now.getUTCMonth() === birth.getUTCMonth() && now.getUTCDate() < birth.getUTCDate());
  if (beforeBirthday) age--;
  return age >= 18 && age <= 120;
}

export const usersRouter = createTRPCRouter({
  // Les champs du compte utiles à l'interface. Les identifiants Stripe et de bac à sable restent côté serveur.
  me: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select({
        id: users.id,
        name: users.name,
        gender: users.gender,
        birthdate: users.birthdate,
        city: users.city,
        bio: users.bio,
        stripeAccountId: users.stripeAccountId,
      })
      .from(users)
      .where(eq(users.id, ctx.session.user.id))
      .limit(1);
    if (!user) return null;

    const { stripeAccountId, ...publicFields } = user;
    return { ...publicFields, hasStripeAccount: !!stripeAccountId };
  }),

  isAdmin: protectedProcedure.query(({ ctx }) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    return !!adminEmail && ctx.session.user.email === adminEmail;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        bio: z.string().max(500).optional(),
        city: z.string().max(100).optional(),
        birthdate: z.union([z.literal(""), z.string().refine(isAdultBirthdate, "Invalid date of birth")]).optional(),
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
      if (ctx.isDemo) throw new TRPCError({ code: "FORBIDDEN", message: "Disabled in the demo" });
      if (input.reportedUserId === ctx.session.user.id) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot report yourself" });
      }
      const reported = await ctx.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, input.reportedUserId))
        .limit(1);
      if (reported.length === 0) throw new TRPCError({ code: "NOT_FOUND" });

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
        throw new TRPCError({ code: "CONFLICT", message: "You have already reported this profile" });
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
    // Démo : les comptes sont supprimés par le nettoyage automatique
    if (ctx.isDemo) throw new TRPCError({ code: "FORBIDDEN", message: "Disabled in the demo" });
    const userId = ctx.session.user.id;

    // Un dépôt en séquestre serait effacé sans être remboursé : il faut d'abord clore les demandes en cours
    const openRequest = await ctx.db.query.dateRequests.findFirst({
      where: and(
        or(eq(dateRequests.requesterId, userId), eq(dateRequests.targetId, userId)),
        inArray(dateRequests.status, ["paid", "accepted"])
      ),
      columns: { id: true },
    });
    if (openRequest) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: "You still have requests with a held deposit. Resolve them before deleting your account.",
      });
    }

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
