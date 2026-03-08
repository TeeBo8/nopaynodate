import { ShieldCheck, Ban, Zap, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Ban,
    title: "Zero ghosting",
    desc: "The deposit creates a real financial commitment. Men who pay are serious — women know it.",
  },
  {
    icon: ShieldCheck,
    title: "100% secure",
    desc: "Payments via Stripe. Funds in escrow until both parties confirm. Automatic refund if declined.",
  },
  {
    icon: Zap,
    title: "You stay in control",
    desc: "Women set their amount, accept or decline freely. No pressure, no commitment until you decide.",
  },
  {
    icon: Lock,
    title: "Verified profiles",
    desc: "Verification process to ensure authenticity. No more fake profiles or unclear intentions.",
  },
];

export function LandingFeatures() {
  return (
    <section className="bg-muted/30 py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why NoPayNoDate is different
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            The first dating system where every interaction has value.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="border-border/60 bg-background/60 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
