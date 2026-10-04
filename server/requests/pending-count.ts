import { and, count, eq, or } from "drizzle-orm";
import { db } from "@/server/db";
import { dateRequests } from "@/server/db/schema";

// Nombre de demandes qui attendent une action de l'utilisateur (pastille du menu) :
// - femme : demande payée à accepter ou refuser, ou rendez-vous à confirmer
// - homme : dépôt à payer, ou rendez-vous à confirmer
export async function countRequestsNeedingAction(
  userId: string,
  gender: string | null | undefined
): Promise<number> {
  const isWoman = gender === "woman";
  const [row] = await db
    .select({ n: count() })
    .from(dateRequests)
    .where(
      isWoman
        ? and(
            eq(dateRequests.targetId, userId),
            or(
              eq(dateRequests.status, "paid"),
              and(eq(dateRequests.status, "accepted"), eq(dateRequests.targetConfirmed, false))
            )
          )
        : and(
            eq(dateRequests.requesterId, userId),
            or(
              eq(dateRequests.status, "pending"),
              and(eq(dateRequests.status, "accepted"), eq(dateRequests.requesterConfirmed, false))
            )
          )
    );
  return row?.n ?? 0;
}
