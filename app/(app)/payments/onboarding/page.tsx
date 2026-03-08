"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/trpc-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, CreditCard, UserCheck, Banknote, ArrowRight, Lock } from "lucide-react";

const STEPS = [
  {
    icon: UserCheck,
    title: "Create your Stripe account",
    desc: "Stripe will ask for your name, email and phone number. Quick — under 2 minutes.",
  },
  {
    icon: CreditCard,
    title: "Verify your identity",
    desc: "Stripe is a regulated financial platform. A government-issued ID (passport, ID card) is required by law to receive payments.",
  },
  {
    icon: Banknote,
    title: "Add your bank account / IBAN",
    desc: "Enter your bank account. Transfers arrive automatically after each confirmed date.",
  },
];

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  const { data: session } = useSession();

  const createAccount = api.deposits.createConnectedAccount.useMutation({
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  if (session?.user?.gender !== "woman") {
    return (
      <div className="max-w-md mx-auto">
        <p className="text-muted-foreground">This page is for women only.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto space-y-6 py-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Account set up!</h1>
            <p className="mt-2 text-muted-foreground">
              Your Stripe Express account is being verified by Stripe (usually a few minutes).
              Once approved, you can accept requests and receive deposits directly to your bank account.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-5 text-left space-y-2">
            <p className="text-sm font-semibold">What happens now:</p>
            {[
              "Stripe verifies your identity (a few minutes to a few hours)",
              "Once approved, you will receive 90% of each deposit after a confirmed date",
              "Transfers are automatic — no action needed from you",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
        <Button asChild className="w-full">
          <Link href="/profile/edit">Back to my profile <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Receive my deposits</h1>
        <p className="mt-1 text-muted-foreground">
          To receive payments from men who contact you, you must connect your bank account via <strong>Stripe</strong> — the payment platform used by millions of businesses (Amazon, Shopify, Uber…).
        </p>
      </div>

      {/* Pourquoi c'est nécessaire */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Why Stripe?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Stripe handles payments securely and legally. Your banking details are never shared with NoPayNoDate or any user. Stripe is PCI-DSS certified (the highest banking security standard).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Les 3 étapes */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">The 3 setup steps (~5 min)</p>
        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ce qu'il vous faut */}
      <Card>
        <CardContent className="p-5">
          <p className="text-sm font-semibold mb-2">Prepare these details:</p>
          <ul className="space-y-1.5">
            {[
              "Your email",
              "Your phone number",
              "A government-issued ID (national ID, passport, or driver's license)",
              "Your IBAN / bank account",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="space-y-3">
        <Button
          onClick={() => createAccount.mutate()}
          disabled={createAccount.isPending}
          className="w-full h-12 text-base"
          size="lg"
        >
          {createAccount.isPending
            ? "Redirecting to Stripe..."
            : "Connect my bank account"}
          {!createAccount.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          You will be redirected to the secure Stripe website. NoPayNoDate never sees your banking data.
        </p>
      </div>
    </div>
  );
}
