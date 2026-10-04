import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../index";
import { messages, dateRequests } from "@/server/db/schema";
import { pusherServer } from "@/server/pusher/server";
import { generateId } from "@/lib/utils";
import { DEMO_MAX_MESSAGES_PER_CHAT } from "@/lib/demo";

export const messagesRouter = createTRPCRouter({
  list: protectedProcedure
    .input(z.object({ requestId: z.string() }))
    .query(async ({ ctx, input }) => {
      const request = await ctx.db.query.dateRequests.findFirst({
        where: eq(dateRequests.id, input.requestId),
        with: { deposit: true },
      });

      if (!request) throw new TRPCError({ code: "NOT_FOUND" });

      const isParticipant =
        request.requesterId === ctx.session.user.id ||
        request.targetId === ctx.session.user.id;
      if (!isParticipant) throw new TRPCError({ code: "FORBIDDEN" });

      if (!request.deposit || !["held", "released"].includes(request.deposit.status)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "The chat is not unlocked yet",
        });
      }

      return ctx.db.query.messages.findMany({
        where: eq(messages.dateRequestId, input.requestId),
        with: { sender: { columns: { id: true, name: true } } },
        orderBy: [asc(messages.createdAt)],
      });
    }),

  send: protectedProcedure
    .input(z.object({ requestId: z.string(), content: z.string().min(1).max(1000) }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.dateRequests.findFirst({
        where: eq(dateRequests.id, input.requestId),
        with: { deposit: true },
      });

      if (!request) throw new TRPCError({ code: "NOT_FOUND" });

      const isParticipant =
        request.requesterId === ctx.session.user.id ||
        request.targetId === ctx.session.user.id;
      if (!isParticipant) throw new TRPCError({ code: "FORBIDDEN" });

      if (!request.deposit || !["held", "released"].includes(request.deposit.status)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "The chat is not unlocked yet",
        });
      }

      const countMessages = async () =>
        (
          await ctx.db.query.messages.findMany({
            where: eq(messages.dateRequestId, input.requestId),
            columns: { id: true },
          })
        ).length;
      const capReached = new TRPCError({
        code: "FORBIDDEN",
        message: `The demo is limited to ${DEMO_MAX_MESSAGES_PER_CHAT} messages per chat.`,
      });

      if (ctx.isDemo && (await countMessages()) >= DEMO_MAX_MESSAGES_PER_CHAT) throw capReached;

      const id = generateId();
      await ctx.db.insert(messages).values({
        id,
        dateRequestId: input.requestId,
        senderId: ctx.session.user.id,
        content: input.content,
      });

      // Des envois simultanés passent tous le premier contrôle : on recompte après l'insertion
      // et on retire le message en trop
      if (ctx.isDemo && (await countMessages()) > DEMO_MAX_MESSAGES_PER_CHAT) {
        await ctx.db.delete(messages).where(eq(messages.id, id));
        throw capReached;
      }

      // Déclencher l'événement temps réel. Le message est déjà enregistré : une panne de Pusher
      // ne doit pas faire échouer l'envoi (l'autre le verra au prochain chargement).
      try {
        await pusherServer.trigger(`private-chat-${input.requestId}`, "new-message", {
          id,
          senderId: ctx.session.user.id,
          content: input.content,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("[Pusher] Erreur d'envoi temps réel:", err);
      }

      return { id };
    }),
});
