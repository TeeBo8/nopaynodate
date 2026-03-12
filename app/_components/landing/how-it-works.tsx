"use client";

import { useRef, useState, useEffect } from "react";
import { UserCheck, CreditCard, ShieldCheck, Heart, MessageSquare, Sparkles } from "lucide-react";

const scenes = [
  {
    step: "01",
    who: null,
    headline: "Sign up in 2 minutes.",
    sub: "Free for everyone. No credit card required. Just your photos, bio, and city.",
    visual: (
      <div className="flex gap-3">
        <div className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-2xl border border-border/50 bg-card text-2xl">
          👨
        </div>
        <div className="flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-2xl border border-border/50 bg-card text-2xl">
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
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <span className="text-3xl">👩</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-primary">$80</span>
          <span className="text-sm text-muted-foreground">/ deposit</span>
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
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <span className="text-3xl">👨</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-primary/15 px-5 py-2 text-sm font-semibold text-primary">
          <CreditCard className="h-4 w-4" />
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
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/8 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
          <ShieldCheck className="h-12 w-12 text-primary" />
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
      <div className="flex gap-4">
        <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-semibold text-green-500">
          <Heart className="h-4 w-4" /> Accept
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border/50 bg-muted/30 px-6 py-3 text-sm font-semibold text-muted-foreground">
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
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        <div className="max-w-[240px] rounded-xl border border-border/50 bg-card px-4 py-3 text-sm">
          <span className="font-semibold text-primary">Sofia</span>
          <span className="text-muted-foreground"> · just now</span>
          <p className="mt-1">&ldquo;I&apos;m free Friday evening 🙂&rdquo;</p>
        </div>
      </div>
    ),
  },
];

export function LandingHowItWorks() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      if (scrollable <= 0) return;
      const progress = Math.max(0, Math.min(1, -top / scrollable));
      setCurrent(Math.min(scenes.length - 1, Math.floor(progress * scenes.length)));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div id="how-it-works" ref={wrapperRef} style={{ height: `${(scenes.length + 1) * 100}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden bg-muted/20 px-4">

        <p className="mb-10 text-xs font-semibold uppercase tracking-widest text-primary">
          How it works
        </p>

        {/* Scenes */}
        <div className="relative flex min-h-[400px] w-full max-w-2xl items-center justify-center">
          {scenes.map((scene, i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-6 text-center transition-all duration-700 ease-out ${
                i === current
                  ? "relative opacity-100 translate-y-0"
                  : `absolute inset-0 pointer-events-none opacity-0 ${
                      i < current ? "-translate-y-10" : "translate-y-10"
                    }`
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold tracking-[0.25em] text-muted-foreground/40">
                  {scene.step}
                </span>
                {scene.who && (
                  <span className="rounded-full border border-border/50 bg-background px-3 py-0.5 text-xs font-semibold text-muted-foreground">
                    {scene.who}
                  </span>
                )}
              </div>

              {scene.visual}

              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                {scene.headline}
              </h2>
              <p className="max-w-lg text-lg text-muted-foreground">{scene.sub}</p>
            </div>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-10 flex items-center gap-2">
          {scenes.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === current ? "w-8 bg-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
