import { z } from "zod";
import { eq, ne, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../index";
import { profiles, users } from "@/server/db/schema";
import { generateId } from "@/lib/utils";

export const profilesRouter = createTRPCRouter({
  myProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, ctx.session.user.id))
      .limit(1);
    return profile[0] ?? null;
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        photos: z.array(z.string()).optional(),
        depositAmount: z.number().min(2000).max(20000).optional(), // 20$ - 200$
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db
        .select()
        .from(profiles)
        .where(eq(profiles.userId, ctx.session.user.id))
        .limit(1);

      if (existing[0]) {
        await ctx.db
          .update(profiles)
          .set({ ...input, lastActive: new Date() })
          .where(eq(profiles.userId, ctx.session.user.id));
      } else {
        await ctx.db.insert(profiles).values({
          id: generateId(),
          userId: ctx.session.user.id,
          photos: input.photos ?? [],
          depositAmount: input.depositAmount ?? 5000,
        });
      }
    }),

  browse: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const currentUser = await ctx.db
        .select({ gender: users.gender })
        .from(users)
        .where(eq(users.id, ctx.session.user.id))
        .limit(1);

      const myGender = currentUser[0]?.gender;
      // Les hommes voient les femmes et vice versa
      const targetGender = myGender === "man" ? "woman" : "man";

      const results = await ctx.db
        .select({
          profile: profiles,
          user: {
            id: users.id,
            name: users.name,
            city: users.city,
            bio: users.bio,
            birthdate: users.birthdate,
            isVerified: users.isVerified,
            premiumUntil: users.premiumUntil,
          },
        })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(
          and(
            eq(profiles.isActive, true),
            eq(users.gender, targetGender),
            ne(users.id, ctx.session.user.id)
          )
        )
        .limit(input.limit)
        .offset(input.offset);

      return results;
    }),

  getById: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select({
          profile: profiles,
          user: {
            id: users.id,
            name: users.name,
            city: users.city,
            bio: users.bio,
            birthdate: users.birthdate,
            isVerified: users.isVerified,
          },
        })
        .from(profiles)
        .innerJoin(users, eq(profiles.userId, users.id))
        .where(eq(users.id, input.userId))
        .limit(1);

      return result[0] ?? null;
    }),
});
