import Stripe from "stripe";
import { isDemo } from "@/lib/demo";

// La démo publique ne doit jamais pouvoir encaisser de vrai argent
if (isDemo && !process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) {
  throw new Error("DEMO_MODE requires a Stripe test key (sk_test_)");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});
