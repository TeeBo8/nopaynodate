import { and, eq } from "drizzle-orm";
import type { db as database } from "@/server/db";
import { deposits, dateRequests } from "@/server/db/schema";

// Paiement confirmé par Stripe : le dépôt passe en séquestre et la demande devient « payée ».
// Appelé par le webhook, et par deposits.syncPayment au retour du formulaire de paiement.
// Les deux écritures ne s'appliquent qu'à un dépôt encore « pending » : un webhook qui arrive
// en retard (ou une seconde fois) ne touche pas à un dépôt déjà remboursé ou versé.
export async function markDepositHeld(
  db: typeof database,
  paymentIntentId: string,
  dateRequestId: string
) {
  await db
    .update(deposits)
    .set({ status: "held", heldAt: new Date() })
    .where(and(eq(deposits.stripePaymentIntentId, paymentIntentId), eq(deposits.status, "pending")));

  await db
    .update(dateRequests)
    .set({ status: "paid", updatedAt: new Date() })
    .where(and(eq(dateRequests.id, dateRequestId), eq(dateRequests.status, "pending")));
}
