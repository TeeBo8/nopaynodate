import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../index";
import { users } from "@/server/db/schema";

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
});
