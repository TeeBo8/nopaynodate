"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Is the deposit a payment for the date itself?",
    a: "No. The deposit is not a payment for an encounter — it is a proof of commitment, exactly like a booking deposit. It compensates the real costs women incur for each date (hair, outfit, transport…). No act is purchased, no intimate service is included. The model is similar to a security deposit: if the date happens, the deposit is transferred; if declined, it is refunded. The content of the date remains entirely free. This site is a technical demo, and nothing here is legal advice.",
  },
  {
    q: "What is escrow? How does it work in practice?",
    a: "When a man pays a deposit, the money does not go immediately to the woman — it is held in escrow by Stripe, our payment partner. It remains locked until the request is resolved: if the woman declines, Stripe automatically refunds the man. If she accepts and the date is confirmed by both parties, Stripe transfers the deposit (minus 10% commission) to the woman's Stripe Express account. The money never passes directly between the two people.",
  },
  {
    q: "Why do women need to create a Stripe Express account?",
    a: "To receive bank transfers, Stripe requires legal identity verification — this is a regulatory requirement (KYC), not our choice. Creating a Stripe Express account is free, takes about 5 minutes, and lets you receive your deposits directly to your bank account. Stripe is the world leader in online payments, used by Amazon, Shopify and millions of businesses.",
  },
  {
    q: "What happens if the date doesn't happen?",
    a: "The woman can decline at any point before the date is confirmed, and the man is refunded in full. The deposit is only released once both of you confirm that the date took place. There is no dispute process in this version: until both sides confirm, the money stays held.",
  },
  {
    q: "Are deposits really refunded if I say no?",
    a: "Yes, 100% and automatically. When a woman declines a request, Stripe immediately triggers the refund. The man gets his full deposit back with no action required. This is the core guarantee of the system: women can decline freely, with no financial consequences for the man.",
  },
  {
    q: "How much is the platform commission?",
    a: "NoPayNoDate takes 10% of each deposit transferred to the woman, only when the date is confirmed. If the woman declines, no commission is charged. For example: for a $100 deposit, the woman receives $90 and the platform keeps $10.",
  },
  {
    q: "Are the profiles real?",
    a: "No. This site is a technical demo: the profiles in Discover are fictional, with illustrated avatars. Nobody can sign up. Each visitor gets two throwaway accounts, one on each side of the flow, and they are deleted after 24 hours.",
  },
];

export function LandingFaq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-28 px-4">
      <div className="mx-auto max-w-5xl">

        {/* 2-column layout: title left, items right */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[280px_1fr] lg:gap-20">

          {/* Left — sticky title */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">FAQ</p>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Answers.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Everything you want to know before getting started.
            </p>
          </div>

          {/* Right — accordion items */}
          <div className="divide-y divide-border/50">
            {faqs.map((faq, i) => (
              <div key={i} className="group">
                <button
                  className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-primary"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="text-base font-semibold leading-snug sm:text-lg">
                    {faq.q}
                  </span>
                  <span className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary">
                    {open === i
                      ? <Minus className="h-4 w-4" />
                      : <Plus className="h-4 w-4" />
                    }
                  </span>
                </button>

                {open === i && (
                  <p className="pb-6 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
