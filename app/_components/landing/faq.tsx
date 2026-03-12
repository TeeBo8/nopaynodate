import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Is this legal? Is it not prostitution?",
    a: "Completely legal, and absolutely not prostitution. The deposit is not a payment for a sexual encounter — it is a proof of commitment, exactly like a booking deposit. It compensates the real costs women incur for each date (hair, outfit, transport…). No act is purchased, no intimate service is included. The model is similar to a security deposit: if the date happens, the deposit is transferred; if declined, it is refunded. The content of the date remains entirely free.",
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
    q: "What happens if the date doesn't go well or is cancelled?",
    a: "If the date is cancelled before it happens, the deposit is refunded to the man. If the date took place but one party disputes it, our team reviews the situation. The deposit remains in escrow during this period. We handle each dispute manually to ensure fairness for both sides.",
  },
  {
    q: "Are deposits really refunded if I say no?",
    a: "Yes, 100% and automatically. When a woman declines a request, Stripe immediately triggers the refund. The man gets his full deposit back with no action required. This is the core guarantee of the system: women can decline freely, with no financial consequences for the man.",
  },
  {
    q: "How much is the platform commission?",
    a: "NoPayNoDate takes 10% of each deposit transferred to the woman, only when the date is confirmed. If the woman declines, no commission is charged. For example: for a $100 deposit, the woman receives $90 and the platform keeps $10. This commission funds maintenance, security, and support.",
  },
  {
    q: "How do I know profiles are real?",
    a: "Every profile goes through manual validation before becoming visible. Photo uploads, bio, and profile information are reviewed. Suspicious accounts are removed. Moreover, the deposit mechanism itself naturally filters out unserious profiles: nobody pays $20–200 for a fake profile.",
  },
];

export function LandingFaq() {
  return (
    <section id="faq" className="py-24 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Everything you want to know before getting started.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-border/60 px-6 data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
