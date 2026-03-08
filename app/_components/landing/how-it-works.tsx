import { CreditCard, MessageSquare, Calendar, Wallet, UserCheck, Heart, Landmark } from "lucide-react";

const stepsMan = [
  {
    icon: UserCheck,
    step: "1",
    title: "Create your profile",
    desc: "Sign up in 2 minutes. Add your photos, bio, and city.",
  },
  {
    icon: CreditCard,
    step: "2",
    title: "Pay the deposit",
    desc: "Each woman sets her own amount ($20–200). Pay it to unlock the chat. 100% refunded if she declines.",
  },
  {
    icon: MessageSquare,
    step: "3",
    title: "Actually talk",
    desc: "The chat opens as soon as she accepts. No more ghosting — your deposit proves your commitment.",
  },
];

const stepsWoman = [
  {
    icon: UserCheck,
    step: "1",
    title: "Create your profile",
    desc: "Free sign-up in 2 minutes. Add your photos, bio, and city.",
  },
  {
    icon: Landmark,
    step: "2",
    title: "Connect your bank account",
    desc: "A Stripe Express account is required to receive your deposits. Quick, secure setup directly from the app.",
    highlight: true,
  },
  {
    icon: Wallet,
    step: "3",
    title: "Set your price",
    desc: "You decide the deposit amount ($20–200). The higher it is, the more you filter out unserious profiles.",
  },
  {
    icon: Heart,
    step: "4",
    title: "Choose freely",
    desc: "Accept or decline each request. If declined, the deposit is automatically refunded to the man.",
  },
  {
    icon: Calendar,
    step: "5",
    title: "Confirm the date & receive",
    desc: "After the date, confirm in the app. The deposit (minus 10% platform commission) is transferred to your account.",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A simple, fair system for both sides.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Côté homme */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                For men
              </span>
            </div>
            <div className="space-y-8">
              {stepsMan.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">STEP {step.step}</span>
                    </div>
                    <h3 className="mt-1 font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Côté femme */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                For women
              </span>
            </div>
            <div className="space-y-8">
              {stepsWoman.map((step) => (
                <div
                  key={step.step}
                  className={`flex gap-4 ${"highlight" in step && step.highlight ? "rounded-xl border border-primary/30 bg-primary/5 p-4 -mx-4" : ""}`}
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${"highlight" in step && step.highlight ? "border-primary/60 bg-primary/15" : "border-primary/20 bg-primary/5"}`}>
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">STEP {step.step}</span>
                      {"highlight" in step && step.highlight && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                          Requis
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
