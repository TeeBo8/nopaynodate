import { eq } from "drizzle-orm";
import type { db as database } from "@/server/db";
import { deposits, dateRequests } from "@/server/db/schema";

// Paiement confirmé par Stripe : le dépôt passe en séquestre et la demande devient « payée ».
// Appelé par le webhook, et par deposits.syncPayment au retour du formulaire de paiement.
export async function markDepositHeld(
  db: typeof database,
  paymentIntentId: string,
  dateRequestId: string
) {
  await db
    .update(deposits)
    .set({ status: "held", heldAt: new Date() })
    .where(eq(deposits.stripePaymentIntentId, paymentIntentId));

  await db
    .update(dateRequests)
    .set({ status: "paid", updatedAt: new Date() })
    .where(eq(dateRequests.id, dateRequestId));
}
