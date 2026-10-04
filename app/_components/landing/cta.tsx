import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { isDemo } from "@/lib/demo";

export function LandingCta() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-primary/8" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Ready to meet someone who truly deserves your time?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          {isDemo
            ? "One click, two throwaway accounts: play both sides of the flow. Stripe test mode, no real money."
            : "Free sign-up in 2 minutes. You set your price, you choose who contacts you. No credit card required to get started."}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" className="h-12 gap-2 px-10 text-base" asChild>
            <Link href="/register">
              {isDemo ? "Enter the demo" : "Create my profile for free"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {!isDemo && (
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="/login">I already have an account</Link>
            </Button>
          )}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {(isDemo
            ? ["No sign-up", "Stripe test mode", "Fictional profiles", "Accounts deleted after 24 hours"]
            : ["Free sign-up", "No credit card required", "Payments via Stripe"]
          ).map((item) => (
            <span key={item}>✓ {item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
