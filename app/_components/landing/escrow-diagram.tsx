"use client";

import { useRef, useState, useEffect } from "react";
import { CreditCard, ShieldCheck, Heart, Banknote, RotateCcw } from "lucide-react";

const scenes = [
  {
    step: "01",
    headline: "He pays a deposit.",
    sub: "From $20 to $200 — the amount you set. No payment, no message. Ever.",
    visual: (
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
          <CreditCard className="h-9 w-9 text-primary" />
        </div>
        <div className="rounded-full bg-primary/15 px-6 py-2 text-xl font-bold text-primary">
          $100 secured
        </div>
      </div>
    ),
  },
  {
    step: "02",
    headline: "Stripe holds it securely.",
    sub: "The money sits in escrow. Not with him. Not with you. With Stripe — until you decide.",
    visual: (
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/25">
          <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
      </div>
    ),
  },
  {
    step: "03",
    headline: "You decide.",
    sub: "Accept or decline — entirely your choice. No pressure, no obligation, no explanation needed.",
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
    step: "04",
    headline: "Either way, it's fair.",
    sub: "She accepts → deposit transferred. She declines → man refunded 100%. The system protects everyone.",
    visual: (
      <div className="flex gap-4">
        <div className="rounded-xl border border-green-500/20 bg-green-500/8 px-6 py-4 text-center">
          <Banknote className="mx-auto mb-2 h-6 w-6 text-green-500" />
          <div className="text-sm font-semibold text-green-500">She accepts</div>
          <div className="mt-1 text-xs text-muted-foreground">$90 transferred</div>
        </div>
        <div className="rounded-xl border border-border/40 bg-muted/20 px-6 py-4 text-center">
          <RotateCcw className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
          <div className="text-sm font-semibold">She declines</div>
          <div className="mt-1 text-xs text-muted-foreground">100% refunded</div>
        </div>
      </div>
    ),
  },
];

export function LandingEscrowDiagram() {
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
    <div ref={wrapperRef} style={{ height: `${(scenes.length + 1) * 100}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4">

        <p className="mb-10 text-xs font-semibold uppercase tracking-widest text-primary">
          How the deposit works
        </p>

        {/* Scenes */}
        <div className="relative flex min-h-[380px] w-full max-w-2xl items-center justify-center">
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
              <span className="text-xs font-bold tracking-[0.25em] text-muted-foreground/40">
                {scene.step}
              </span>
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
