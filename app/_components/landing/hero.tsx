import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ShieldCheck, MapPin, Heart } from "lucide-react";

const mockProfiles = [
  { initials: "S", name: "Sofia", age: 27, city: "New York", deposit: 80, color: "bg-rose-400" },
  { initials: "L", name: "Laura", age: 31, city: "Los Angeles", deposit: 50, color: "bg-violet-400" },
  { initials: "C", name: "Camille", age: 25, city: "Chicago", deposit: 120, color: "bg-amber-400" },
];

export function LandingHero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-16 text-center">
      {/* Gradient de fond */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <Badge variant="secondary" className="mb-6 gap-1.5 px-4 py-1.5 text-sm">
        <ShieldCheck className="h-3.5 w-3.5" />
        Secure deposits via Stripe — refunded if declined
      </Badge>

      <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
        Serious Dating.{" "}
        <span className="text-primary">Guaranteed.</span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
        Women spend on average{" "}
        <strong className="text-foreground">$2,381/year</strong> preparing
        for dates with uncommitted strangers. On NoPayNoDate, every
        man pays a deposit before contacting you. You accept or decline
        — entirely your choice.
      </p>

      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button size="lg" className="h-12 gap-2 px-8 text-base" asChild>
          <Link href="/register">
            Find a real connection
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
          <Link href="/login">I already have an account</Link>
        </Button>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        Free sign-up · No credit card required
      </p>

      {/* Mockup — aperçu de profils */}
      <div className="mt-16 flex flex-wrap justify-center gap-4 w-full max-w-2xl">
        {mockProfiles.map((p) => (
          <div
            key={p.name}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-sm px-4 py-3 shadow-sm"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm ${p.color}`}>
              {p.initials}
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">
                {p.name}, {p.age}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {p.city}
              </div>
            </div>
            <div className="ml-2 flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Heart className="h-3 w-3" />
              {p.deposit}$
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border/60 px-4 py-3 text-xs text-muted-foreground">
          + profiles near you
        </div>
      </div>
    </section>
  );
}
