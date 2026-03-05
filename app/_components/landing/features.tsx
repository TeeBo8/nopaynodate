import { ShieldCheck, Ban, Zap, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Ban,
    title: "Zéro ghosting",
    desc: "Le dépôt crée un engagement financier réel. Les hommes qui versent sont sérieux — les femmes le savent.",
  },
  {
    icon: ShieldCheck,
    title: "100% sécurisé",
    desc: "Paiements via Stripe. Fonds en escrow jusqu'à confirmation des deux parties. Remboursement automatique en cas de refus.",
  },
  {
    icon: Zap,
    title: "Vous contrôlez tout",
    desc: "Les femmes fixent leur montant, acceptent ou refusent librement. Aucune pression, aucun engagement avant d'avoir choisi.",
  },
  {
    icon: Lock,
    title: "Profils vérifiés",
    desc: "Processus de vérification pour garantir l'authenticité. Fini les faux profils et les intentions floues.",
  },
];

export function LandingFeatures() {
  return (
    <section className="bg-muted/30 py-24 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pourquoi NoPayNoDate est différent
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Le premier système de rencontres où chaque interaction a de la valeur.
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
