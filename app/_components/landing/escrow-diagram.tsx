"use client";

import { CreditCard, ShieldCheck, Heart, Banknote, RotateCcw } from "lucide-react";

const HEARTS = [
  { left: "6%",  delay: "0s",   duration: "11s", size: "0.9rem" },
  { left: "18%", delay: "3s",   duration: "9s",  size: "1.2rem" },
  { left: "35%", delay: "1.5s", duration: "13s", size: "0.7rem" },
  { left: "58%", delay: "5s",   duration: "10s", size: "1.0rem" },
  { left: "75%", delay: "2s",   duration: "12s", size: "1.4rem" },
  { left: "90%", delay: "4s",   duration: "8s",  size: "0.8rem" },
];

const steps = [
  {
    step: "01",
    headline: "He pays a deposit.",
    sub: "From $20 to $200 — the amount you set. No payment, no message. Ever.",
    visual: (
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <CreditCard className="h-8 w-8 text-primary" />
        </div>
        <div className="rounded-full bg-primary/15 px-4 py-1.5 text-sm font-bold text-primary">
          $100 secured
        </div>
      </div>
    ),
  },
  {
    step: "02",
    headline: "Stripe holds it.",
    sub: "The money sits in escrow — not with him, not with you. With Stripe until you decide.",
    visual: (
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/25">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
      </div>
    ),
  },
  {
    step: "03",
    headline: "You decide.",
    sub: "Accept or decline — entirely your choice. No pressure, no obligation, no explanation needed.",
    visual: (
      <div className="flex gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-xs font-semibold text-green-500">
          <Heart className="h-3.5 w-3.5" /> Accept
        </div>
        <div className="flex items-center rounded-full border border-border/50 bg-muted/30 px-4 py-2 text-xs font-semibold text-muted-foreground">
          Decline
        </div>
      </div>
    ),
  },
  {
    step: "04",
    headline: "Either way, it's fair.",
    sub: "Date confirmed by both → deposit transferred. She declines → man refunded 100%.",
    visual: (
      <div className="flex gap-2">
        <div className="rounded-lg border border-green-500/20 bg-green-500/8 px-3 py-2 text-center">
          <Banknote className="mx-auto mb-1 h-5 w-5 text-green-500" />
          <div className="text-xs font-semibold text-green-500">Accepted</div>
          <div className="text-xs text-muted-foreground">$90 sent</div>
        </div>
        <div className="rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-center">
          <RotateCcw className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
          <div className="text-xs font-semibold">Declined</div>
          <div className="text-xs text-muted-foreground">100% back</div>
        </div>
      </div>
    ),
  },
];

export function LandingEscrowDiagram() {
  return (
    <section className="relative overflow-hidden py-28 px-4">

      {/* Floating hearts */}
      {HEARTS.map((h, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute select-none text-primary/40"
          style={{
            bottom: "-40px",
            left: h.left,
            fontSize: h.size,
            animation: `float-up ${h.duration} ${h.delay} linear infinite`,
            lineHeight: 1,
          }}
        >
          ♥
        </span>
      ))}

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">
            How the deposit works
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Simple. Safe. Fair.
          </h2>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-7 text-center transition-colors hover:border-primary/30"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/0 transition-colors group-hover:bg-primary/3" />
              <div className="relative flex flex-col items-center gap-4">
                <span className="text-xs font-bold tracking-[0.25em] text-muted-foreground/40">
                  {s.step}
                </span>
                {s.visual}
                <div>
                  <h3 className="text-lg font-bold leading-tight">{s.headline}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
