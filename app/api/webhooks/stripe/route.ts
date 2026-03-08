import { headers } from "next/headers";
import { stripe } from "@/server/stripe/client";
import { db } from "@/server/db";
import { deposits, dateRequests, users, subscriptions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { generateId } from "@/lib/utils";
import { sendEmail } from "@/server/emails";
import { DepotRecuHommeEmail } from "@/server/emails/templates/depot-recu-homme";
import { DepotRecuFemmeEmail } from "@/server/emails/templates/depot-recu-femme";

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

      // Emails : confirmation homme + notification femme
      const deposit = await db.query.deposits.findFirst({
        where: eq(deposits.stripePaymentIntentId, pi.id),
      });
      const request = await db.query.dateRequests.findFirst({
        where: eq(dateRequests.id, dateRequestId),
        with: { requester: true, target: true },
      });
      if (deposit && request) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
        await Promise.all([
          sendEmail({
            to: request.requester.email,
            subject: `Deposit confirmed — your request to ${request.target.name} is pending`,
            react: DepotRecuHommeEmail({
              manName: request.requester.name,
              womanName: request.target.name,
              amount: deposit.amount,
              chatUrl: `${appUrl}/requests`,
            }),
          }),
          sendEmail({
            to: request.target.email,
            subject: `${request.requester.name} vous a envoyé une demande`,
            react: DepotRecuFemmeEmail({
              womanName: request.target.name,
              manName: request.requester.name,
              amount: deposit.amount,
              netAmount: deposit.netAmount,
              requestsUrl: `${appUrl}/requests`,
            }),
          }),
        ]);
      }

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

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

      const user = await db.query.users.findFirst({
        where: eq(users.stripeCustomerId, customerId),
      });
      if (!user) break;

      const isActive = sub.status === "active" || sub.status === "trialing";
      const periodEnd = new Date((sub.items.data[0]?.current_period_end ?? sub.billing_cycle_anchor) * 1000);
      const priceId = sub.items.data[0]?.price.id ?? "";

      const existing = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.stripeSubscriptionId, sub.id),
      });

      if (existing) {
        await db
          .update(subscriptions)
          .set({
            status: sub.status as "active" | "past_due" | "canceled",
            currentPeriodEnd: periodEnd,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.stripeSubscriptionId, sub.id));
      } else {
        await db.insert(subscriptions).values({
          id: generateId(),
          userId: user.id,
          stripeSubscriptionId: sub.id,
          stripePriceId: priceId,
          status: sub.status as "active" | "past_due" | "canceled",
          currentPeriodEnd: periodEnd,
        });
      }

      await db
        .update(users)
        .set({
          premiumUntil: isActive ? periodEnd : null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

      const user = await db.query.users.findFirst({
        where: eq(users.stripeCustomerId, customerId),
      });
      if (!user) break;

      await db
        .update(subscriptions)
        .set({ status: "canceled", updatedAt: new Date() })
        .where(eq(subscriptions.stripeSubscriptionId, sub.id));

      await db
        .update(users)
        .set({ premiumUntil: null, updatedAt: new Date() })
        .where(eq(users.id, user.id));

      break;
    }

    default:
      break;
  }

  return new Response("ok", { status: 200 });
}
