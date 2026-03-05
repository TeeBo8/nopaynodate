import { headers } from "next/headers";
import { stripe } from "@/server/stripe/client";
import { db } from "@/server/db";
import { deposits, dateRequests, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded": {
      const pi = event.data.object;
      const { dateRequestId } = pi.metadata;
      if (!dateRequestId) break;

      await db
        .update(deposits)
        .set({ status: "held", heldAt: new Date() })
        .where(eq(deposits.stripePaymentIntentId, pi.id));

      await db
        .update(dateRequests)
        .set({ status: "paid", updatedAt: new Date() })
        .where(eq(dateRequests.id, dateRequestId));

      break;
    }

    case "account.updated": {
      const account = event.data.object;
      if (account.charges_enabled) {
        await db
          .update(users)
          .set({ isStripeVerified: true, updatedAt: new Date() })
          .where(eq(users.stripeAccountId, account.id));
      }
      break;
    }

    default:
      break;
  }

  return new Response("ok", { status: 200 });
}
