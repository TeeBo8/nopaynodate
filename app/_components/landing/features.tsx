import { ShieldCheck, Ban, Zap, Lock } from "lucide-react";

const features = [
  {
    icon: Ban,
    title: "Zero ghosting",
    desc: "The deposit creates a real financial commitment. Men who pay are serious — women know it immediately.",
    span: "lg:col-span-2",
    size: "large",
  },
  {
    icon: ShieldCheck,
    title: "Secured by Stripe",
    desc: "Payments via Stripe. Funds held until she decides. Automatic refund if declined.",
    span: "",
    size: "small",
  },
  {
    icon: Zap,
    title: "You stay in control",
    desc: "Set your amount, accept or decline freely. No pressure until you decide.",
    span: "",
    size: "small",
  },
  {
    icon: Lock,
    title: "No payment, no message",
    desc: "The private chat only opens once the deposit is held. Messages arrive in real time, and the conversation stays between the two of you.",
    span: "lg:col-span-2",
    size: "large",
  },
];

export function LandingFeatures() {
  return (
    <section className="py-28 px-4">
      <div className="mx-auto max-w-6xl">

        <div className="mb-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-primary">Why us</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The first dating system<br />where every interaction has value.
            </h2>
          </div>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group relative overflow-hidden rounded-2xl border border-border/50 bg-card p-7 transition-colors hover:border-primary/30 ${f.span}`}
            >
              {/* Subtle glow on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-primary/0 transition-colors group-hover:bg-primary/3" aria-hidden="true" />

              <div className="relative">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className={`font-bold ${f.size === "large" ? "text-xl" : "text-base"}`}>{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
