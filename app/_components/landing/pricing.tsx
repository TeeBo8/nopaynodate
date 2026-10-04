import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";
import { isDemo } from "@/lib/demo";

const freeFeatures = [
  "Full profile with photos",
  "Access to browse",
  "Receive requests (women)",
  "Send requests with deposit (men)",
  "Chat once the deposit is paid",
];

const premiumFeatures = [
  "Everything in the free plan",
  "Boosted profile in browse",
  "Visible premium badge",
];

export function LandingPricing() {
  return (
    <section id="pricing" className="bg-muted/30 py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Free to start, premium to stand out.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Gratuit */}
          <Card className="border-border/60">
            <CardHeader className="p-6 pb-0">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Free</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">To start and explore.</p>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-6 w-full" asChild>
                <Link href="/register">{isDemo ? "Enter the demo" : "Get started for free"}</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card className="border-primary/40 relative overflow-hidden">
            <CardHeader className="p-6 pb-0">
              <div className="text-sm font-semibold text-primary uppercase tracking-wide">Premium</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">$19.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">To maximize your chances.</p>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {premiumFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" asChild>
                <Link href="/register">{isDemo ? "Try it in the demo" : "Go premium"}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 rounded-xl border border-border/60 bg-muted/30 px-6 py-4 text-sm text-muted-foreground space-y-1.5">
          <p>
            <span className="font-semibold text-foreground">Deposits (men):</span>{" "}
            $20–200 set by the woman, paid before each contact. 100% refunded if she declines.
          </p>
          <p>
            <span className="font-semibold text-foreground">Platform commission:</span>{" "}
            10% taken from the deposit when transferred to the woman after a confirmed date.
          </p>
          <p>
            <span className="font-semibold text-foreground">Payments via Stripe:</span>{" "}
            Women must connect a Stripe Express account to receive their deposits (free, setup in minutes).
          </p>
        </div>
      </div>
    </section>
  );
}
