import { z } from "zod";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../index";
import { profiles } from "@/server/db/schema";
import { generateId } from "@/lib/utils";

// Seules les photos passées par Uploadthing sont acceptées (pas d'URL arbitraire)
function isUploadedPhoto(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && (hostname === "utfs.io" || hostname.endsWith(".ufs.sh"));
  } catch {
    return false;
  }
}

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
        photos: z.array(z.string()).max(6).optional(),
        depositAmount: z.number().int().min(2000).max(20000).optional(), // centimes : 20$ - 200$
      })
    )
    .mutation(async ({ ctx, input: rawInput }) => {
      // Démo : pas d'upload, les photos (avatars illustrés) ne sont pas modifiables
      const input: typeof rawInput = ctx.isDemo ? { depositAmount: rawInput.depositAmount } : rawInput;
      if (input.photos && !input.photos.every(isUploadedPhoto)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid photo" });
      }

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
});
