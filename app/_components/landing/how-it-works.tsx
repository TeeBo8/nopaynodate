import { CreditCard, MessageSquare, Calendar, Wallet, UserCheck, Heart } from "lucide-react";

const stepsHomme = [
  {
    icon: UserCheck,
    step: "1",
    title: "Créez votre profil",
    desc: "Inscription en 2 minutes. Ajoutez vos photos, votre bio, votre ville.",
  },
  {
    icon: CreditCard,
    step: "2",
    title: "Versez le dépôt",
    desc: "Chaque femme fixe son propre montant (20–200$). Versez-le pour débloquer le chat. 100% remboursé si elle refuse.",
  },
  {
    icon: MessageSquare,
    step: "3",
    title: "Discutez vraiment",
    desc: "Le chat est ouvert dès qu'elle accepte. Plus de ghosting — votre dépôt prouve votre sérieux.",
  },
];

const stepsFemme = [
  {
    icon: Wallet,
    step: "1",
    title: "Fixez votre prix",
    desc: "Vous décidez du montant du dépôt. Plus il est élevé, plus vous filtrez les profils peu sérieux.",
  },
  {
    icon: Heart,
    step: "2",
    title: "Choisissez librement",
    desc: "Acceptez ou refusez chaque demande. En cas de refus, le dépôt est remboursé automatiquement.",
  },
  {
    icon: Calendar,
    step: "3",
    title: "Confirmez la date",
    desc: "Après la date, confirmez côté app. Le dépôt vous est transféré immédiatement via Stripe.",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Comment ça marche
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Un système simple, juste pour les deux parties.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Côté homme */}
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                Pour les hommes
              </span>
            </div>
            <div className="space-y-8">
              {stepsHomme.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">ÉTAPE {step.step}</span>
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
                Pour les femmes
              </span>
            </div>
            <div className="space-y-8">
              {stepsFemme.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">ÉTAPE {step.step}</span>
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
