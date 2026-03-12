"use client";

import { CreditCard, ShieldCheck, Heart, MessageSquare } from "lucide-react";

const HEARTS = [
  { left: "4%",  delay: "0s",   duration: "10s", size: "1.0rem" },
  { left: "15%", delay: "4s",   duration: "13s", size: "0.7rem" },
  { left: "28%", delay: "2s",   duration: "9s",  size: "1.3rem" },
  { left: "48%", delay: "6s",   duration: "11s", size: "0.8rem" },
  { left: "65%", delay: "1s",   duration: "12s", size: "1.1rem" },
  { left: "80%", delay: "3.5s", duration: "8s",  size: "1.5rem" },
  { left: "93%", delay: "5s",   duration: "10s", size: "0.9rem" },
];

const steps = [
  {
    step: "01",
    who: null,
    headline: "Sign up in 2 minutes.",
    sub: "Free for everyone. No credit card required. Just your photos, bio, and city.",
    visual: (
      <div className="flex gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 bg-card text-2xl">
          👨
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/50 bg-card text-2xl">
          👩
        </div>
      </div>
    ),
  },
  {
    step: "02",
    who: "For women",
    headline: "You set your price.",
    sub: "Pick your deposit amount — from $20 to $200. Higher means fewer, more serious requests.",
    visual: (
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <span className="text-2xl">👩</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-primary">$80</span>
          <span className="text-xs text-muted-foreground">/ deposit</span>
        </div>
      </div>
    ),
  },
  {
    step: "03",
    who: "For men",
    headline: "He pays to connect.",
    sub: "Find someone interesting, pay her deposit to send a request. His commitment is real — in dollars.",
    visual: (
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <span className="text-2xl">👨</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary/15 px-4 py-1.5 text-xs font-semibold text-primary">
          <CreditCard className="h-3.5 w-3.5" />
          $80 deposit paid
        </div>
      </div>
    ),
  },
  {
    step: "04",
    who: null,
    headline: "Stripe holds the funds.",
    sub: "Nobody touches the money. Stripe keeps it in escrow until she makes her decision.",
    visual: (
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
      </div>
    ),
  },
  {
    step: "05",
    who: "For women",
    headline: "You accept or decline.",
    sub: "Her inbox, her rules. Accept and start a real conversation. Decline and the man is fully refunded.",
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
    step: "06",
    who: null,
    headline: "A real connection.",
    sub: "Chat opens. Date planned. Deposit transferred after confirmation. Zero ghosting. Zero waste.",
    visual: (
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <MessageSquare className="h-7 w-7 text-primary" />
        </div>
        <div className="max-w-[180px] rounded-xl border border-border/50 bg-card px-3 py-2 text-xs">
          <span className="font-semibold text-primary">Sofia</span>
          <p className="mt-0.5 text-muted-foreground">&ldquo;Free Friday evening 🙂&rdquo;</p>
        </div>
      </div>
    ),
  },
];

export function LandingHowItWorks() {
  return (
    <div id="how-it-works" className="relative overflow-hidden bg-muted/20 py-28 px-4">

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
            How it works
          </p>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            6 steps to a real date.
          </h2>
        </div>

        {/* Steps grid — 3 cols, 2 rows */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <div
              key={i}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-7 transition-colors hover:border-primary/30"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/0 transition-colors group-hover:bg-primary/3" />
              <div className="relative flex flex-col items-start gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold tracking-[0.25em] text-muted-foreground/40">
                    {s.step}
                  </span>
                  {s.who && (
                    <span className="rounded-full border border-border/50 bg-background px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                      {s.who}
                    </span>
                  )}
                </div>
                <div className="flex justify-center w-full">{s.visual}</div>
                <div>
                  <h3 className="text-lg font-bold leading-tight">{s.headline}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
