import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, MapPin, Heart } from "lucide-react";

const mockProfiles = [
  { initials: "S", name: "Sofia",   age: 27, city: "New York",    deposit: 80,  color: "bg-violet-500" },
  { initials: "L", name: "Laura",   age: 31, city: "Los Angeles", deposit: 50,  color: "bg-cyan-500"   },
  { initials: "C", name: "Camille", age: 25, city: "Chicago",     deposit: 120, color: "bg-amber-400"  },
];

const HEARTS = [
  { left: "4%",  delay: "0s",   duration: "10s",  size: "1.3rem" },
  { left: "11%", delay: "3s",   duration: "13s",  size: "0.9rem" },
  { left: "20%", delay: "6s",   duration: "9s",   size: "1.9rem" },
  { left: "30%", delay: "1.5s", duration: "14s",  size: "1.1rem" },
  { left: "41%", delay: "4.5s", duration: "11s",  size: "1.6rem" },
  { left: "53%", delay: "0.8s", duration: "8s",   size: "0.8rem" },
  { left: "63%", delay: "7s",   duration: "12s",  size: "2.1rem" },
  { left: "73%", delay: "2.2s", duration: "10s",  size: "1.2rem" },
  { left: "83%", delay: "5s",   duration: "9.5s", size: "1.7rem" },
  { left: "92%", delay: "2s",   duration: "13s",  size: "1rem"   },
];

export function LandingHero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-4 pt-16">

      {/* ── Floating hearts ── */}
      {HEARTS.map((h, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute select-none text-primary/60"
          style={{
            bottom: "-60px",
            left: h.left,
            fontSize: h.size,
            animation: `float-up ${h.duration} ${h.delay} linear infinite`,
            lineHeight: 1,
          }}
        >
          ♥
        </span>
      ))}

      {/* ── Background glow ── */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/3 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* ── Two-column grid ── */}
      <div className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16">

        {/* ── Left — text + CTA ── */}
        <div className="flex flex-col gap-6">

          <div className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Secure deposits via Stripe — refunded if declined
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Serious Dating.{" "}
            <span className="relative inline-block text-primary">
              Guaranteed.
              <span
                className="pointer-events-none absolute inset-0 select-none text-primary opacity-50 blur-2xl"
                aria-hidden="true"
              >
                Guaranteed.
              </span>
            </span>
          </h1>

          <p className="max-w-lg text-lg text-muted-foreground">
            Women spend on average{" "}
            <strong className="text-foreground">$2,381/year</strong> preparing
            for dates with uncommitted strangers. On NoPayNoDate, every man
            pays a deposit before contacting you. You accept or decline —
            entirely your choice.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 gap-2 px-8 text-base font-semibold shadow-[0_0_28px_rgba(0,210,170,0.35)] transition-shadow hover:shadow-[0_0_44px_rgba(0,210,170,0.55)]"
              asChild
            >
              <Link href="/register">
                Find a real connection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="/login">I already have an account</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Free sign-up · No credit card required
          </p>

          {/* Stats */}
          <div className="flex gap-8 pt-2">
            <div>
              <div className="text-xl font-bold">12,847</div>
              <div className="text-xs text-muted-foreground">Women registered</div>
            </div>
            <div className="w-px bg-border" />
            <div>
              <div className="text-xl font-bold">$2.4M</div>
              <div className="text-xs text-muted-foreground">Deposits secured</div>
            </div>
            <div className="w-px bg-border" />
            <div>
              <div className="text-xl font-bold">4,200+</div>
              <div className="text-xs text-muted-foreground">Connections made</div>
            </div>
          </div>
        </div>

        {/* ── Right — profile cards ── */}
        <div className="flex flex-col gap-4">
          {mockProfiles.map((p) => (
            <div
              key={p.name}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background/80 px-5 py-4 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white ${p.color}`}
              >
                {p.initials}
              </div>
              <div className="flex-1">
                <div className="font-semibold">
                  {p.name}, {p.age}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {p.city}
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-primary/15 px-4 py-1.5 text-sm font-semibold text-primary">
                <Heart className="h-3.5 w-3.5" />
                {p.deposit}$
              </div>
            </div>
          ))}

          <div className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 px-5 py-4 text-sm text-muted-foreground">
            + profiles near you
          </div>
        </div>

      </div>
    </section>
  );
}
