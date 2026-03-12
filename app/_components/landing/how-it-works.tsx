import type { LucideIcon } from "lucide-react";
import { CreditCard, MessageSquare, Calendar, Wallet, UserCheck, Heart, Landmark } from "lucide-react";

type Step = {
  icon: LucideIcon;
  step: string;
  title: string;
  desc: string;
  highlight?: boolean;
};

const stepsMan = [
  {
    icon: UserCheck,
    step: "01",
    title: "Create your profile",
    desc: "Sign up in 2 minutes. Add your photos, bio, and city.",
  },
  {
    icon: CreditCard,
    step: "02",
    title: "Pay the deposit",
    desc: "Each woman sets her own amount ($20–200). Pay it to unlock the chat. 100% refunded if she declines.",
  },
  {
    icon: MessageSquare,
    step: "03",
    title: "Actually talk",
    desc: "The chat opens as soon as she accepts. No more ghosting — your deposit proves your commitment.",
  },
];

const stepsWoman = [
  {
    icon: UserCheck,
    step: "01",
    title: "Create your profile",
    desc: "Free sign-up in 2 minutes. Add your photos, bio, and city.",
  },
  {
    icon: Landmark,
    step: "02",
    title: "Connect your bank account",
    desc: "A Stripe Express account is required to receive your deposits. Quick, secure setup directly from the app.",
    highlight: true,
  },
  {
    icon: Wallet,
    step: "03",
    title: "Set your price",
    desc: "You decide the deposit amount ($20–200). The higher it is, the more you filter out unserious profiles.",
  },
  {
    icon: Heart,
    step: "04",
    title: "Choose freely",
    desc: "Accept or decline each request. If declined, the deposit is automatically refunded to the man.",
  },
  {
    icon: Calendar,
    step: "05",
    title: "Confirm the date & receive",
    desc: "After the date, confirm in the app. The deposit (minus 10% commission) is transferred to your account.",
  },
];

function StepList({ steps }: { steps: Step[] }) {
  return (
    <div className="relative">
      {/* Vertical connecting line */}
      <div className="absolute left-5 top-10 bottom-10 w-px bg-border/60" aria-hidden="true" />

      <div className="space-y-0">
        {steps.map((step, i) => (
          <div
            key={step.step}
            className={`relative flex gap-6 pb-10 last:pb-0 ${
              "highlight" in step && step.highlight
                ? "rounded-xl border border-primary/25 bg-primary/5 p-5 -ml-5 pl-5"
                : ""
            }`}
          >
            {/* Step circle — sits on the line */}
            <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
              "highlight" in step && step.highlight
                ? "border-primary bg-primary/15"
                : "border-border bg-background"
            }`}>
              <step.icon className={`h-4 w-4 ${"highlight" in step && step.highlight ? "text-primary" : "text-muted-foreground"}`} />
            </div>

            <div className="pt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tabular-nums text-muted-foreground/60">{step.step}</span>
                {"highlight" in step && step.highlight && (
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                    Required
                  </span>
                )}
              </div>
              <h3 className="mt-0.5 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="bg-muted/20 py-28 px-4">
      <div className="mx-auto max-w-6xl">

        <div className="mb-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            A simple, fair system<br className="hidden sm:block" /> for both sides.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">

          {/* For men */}
          <div>
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background px-4 py-2 text-sm font-semibold">
              <span>👨</span> For men
            </div>
            <StepList steps={stepsMan} />
          </div>

          {/* For women */}
          <div>
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-border/50 bg-background px-4 py-2 text-sm font-semibold">
              <span>👩</span> For women
            </div>
            <StepList steps={stepsWoman} />
          </div>

        </div>
      </div>
    </section>
  );
}
