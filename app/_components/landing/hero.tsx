import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, MapPin, Heart, MessageCircle } from "lucide-react";
import { isDemo } from "@/lib/demo";

/* ── Floating hearts ── */
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

/* ── Scattered floating cards data ── */
const cards = {
  profile: { initials: "S", name: "Sofia", age: 27, city: "New York", deposit: 80, color: "bg-violet-500" },
  match:   { name: "Laura",   message: "Accepted your deposit request" },
  deposit: { amount: 120, label: "Camille · held in escrow" },
  chat:    { author: "Sofia", text: "I'm free Friday evening, how about you? 😊" },
};

export function LandingHero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">

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

      {/* ── Subtle glow at center ── */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-primary/4 blur-3xl" />
      </div>

      {/* ════════════════════════════════
          Floating cards — desktop only
          ════════════════════════════════ */}

      {/* Card 1 — Profile (top-left) */}
      <div
        className="pointer-events-none absolute top-[13%] left-[3%] hidden xl:block"
        style={{ transform: "rotate(-6deg)" }}
        aria-hidden="true"
      >
        <div style={{ animation: "bob 6s ease-in-out infinite" }}>
          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/85 px-4 py-3.5 shadow-2xl backdrop-blur-md">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${cards.profile.color}`}>
              {cards.profile.initials}
            </div>
            <div>
              <div className="text-sm font-semibold">{cards.profile.name}, {cards.profile.age}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {cards.profile.city}
              </div>
            </div>
            <div className="ml-1 flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
              <Heart className="h-3 w-3" />
              ${cards.profile.deposit}
            </div>
          </div>
        </div>
      </div>

      {/* Card 2 — Match notification (top-right) */}
      <div
        className="pointer-events-none absolute top-[10%] right-[4%] hidden xl:block"
        style={{ transform: "rotate(5deg)" }}
        aria-hidden="true"
      >
        <div style={{ animation: "bob 7s ease-in-out 1.2s infinite" }}>
          <div className="rounded-2xl border border-green-500/25 bg-background/85 px-4 py-3.5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/15 text-base">
                💚
              </div>
              <div>
                <div className="text-sm font-semibold">It&apos;s a match!</div>
                <div className="text-xs text-muted-foreground">{cards.match.name} · {cards.match.message}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3 — Deposit secured (bottom-left) */}
      <div
        className="pointer-events-none absolute bottom-[26%] left-[2%] hidden xl:block"
        style={{ transform: "rotate(4deg)" }}
        aria-hidden="true"
      >
        <div style={{ animation: "bob 8s ease-in-out 2s infinite" }}>
          <div className="rounded-2xl border border-border/50 bg-background/85 px-4 py-3.5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{cards.deposit.label}</div>
                <div className="text-sm font-bold">${cards.deposit.amount} secured</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground/70">via Stripe · 100% refundable</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4 — Chat bubble (bottom-right) */}
      <div
        className="pointer-events-none absolute bottom-[22%] right-[3%] hidden xl:block"
        style={{ transform: "rotate(-4deg)" }}
        aria-hidden="true"
      >
        <div style={{ animation: "bob 5.5s ease-in-out 0.5s infinite" }}>
          <div className="w-[220px] rounded-2xl border border-border/50 bg-background/85 px-4 py-3.5 shadow-2xl backdrop-blur-md">
            <div className="mb-2 flex items-center gap-2">
              <MessageCircle className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">{cards.chat.author}</span>
              <span className="text-xs text-muted-foreground">· just now</span>
            </div>
            <p className="text-sm leading-relaxed">&ldquo;{cards.chat.text}&rdquo;</p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════
          Center content
          ════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
          <ShieldCheck className="h-3.5 w-3.5" />
          {isDemo
            ? "Technical demo · fictional profiles · no real money"
            : "Deposits held in Stripe escrow — refunded if declined"}
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
          Dating where{" "}
          <span className="relative inline-block text-primary">
            intent
            <span
              className="pointer-events-none absolute inset-0 select-none text-primary opacity-40 blur-2xl"
              aria-hidden="true"
            >
              intent
            </span>
          </span>
          {" "}is proven.
        </h1>

        {/* Sub-headline */}
        <p className="max-w-xl text-lg text-muted-foreground sm:text-xl">
          Men pay a deposit ($20–$200) to unlock your inbox.
          You accept or decline — entirely your choice.
          Zero ghosting. Zero wasted time.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="h-12 gap-2 px-8 text-base font-semibold shadow-[0_0_28px_rgba(0,210,170,0.35)] transition-shadow hover:shadow-[0_0_44px_rgba(0,210,170,0.55)]"
            asChild
          >
            <Link href="/register">
              {isDemo ? "Enter the demo" : "Start for free"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          {!isDemo && (
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
              <Link href="/login">I already have an account</Link>
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground">{isDemo ? "No sign-up · Stripe test mode, no real money" : "Free sign-up · No credit card required"}</p>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted-foreground/60">
        <span>Scroll to explore</span>
        <span className="animate-bounce">↓</span>
      </div>
    </section>
  );
}
