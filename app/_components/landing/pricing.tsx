import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const freeFeatures = [
  "Profil complet avec photos",
  "Accès au browse",
  "Recevoir des demandes (femmes)",
  "Envoyer des demandes avec dépôt (hommes)",
  "Chat après acceptation",
];

const premiumFeatures = [
  "Tout du plan gratuit",
  "Profil mis en avant dans le browse",
  "Badge premium visible",
  "Accès prioritaire aux nouveaux profils",
  "Support prioritaire",
];

export function LandingPricing() {
  return (
    <section className="bg-muted/30 py-24 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tarifs simples et transparents
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Gratuit pour commencer, premium pour se démarquer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          {/* Gratuit */}
          <Card className="border-border/60">
            <CardHeader className="p-6 pb-0">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Gratuit</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">0$</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Pour commencer et explorer.</p>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {freeFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="mt-6 w-full" asChild>
                <Link href="/register">Commencer gratuitement</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card className="border-primary/40 relative overflow-hidden">
            <div className="absolute right-4 top-4">
              <Badge>Populaire</Badge>
            </div>
            <CardHeader className="p-6 pb-0">
              <div className="text-sm font-semibold text-primary uppercase tracking-wide">Premium</div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold">19,99$</span>
                <span className="text-muted-foreground">/mois</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Pour maximiser vos chances.</p>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {premiumFeatures.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" asChild>
                <Link href="/register">Passer premium</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 rounded-xl border border-border/60 bg-muted/30 px-6 py-4 text-sm text-muted-foreground space-y-1.5">
          <p>
            <span className="font-semibold text-foreground">Dépôts (hommes) :</span>{" "}
            20–200$ fixé par la femme, versé avant chaque contact. 100% remboursé si elle refuse.
          </p>
          <p>
            <span className="font-semibold text-foreground">Commission plateforme :</span>{" "}
            10% prélevés sur le dépôt lors du transfert à la femme après la date confirmée.
          </p>
          <p>
            <span className="font-semibold text-foreground">Paiements via Stripe :</span>{" "}
            Les femmes doivent connecter un compte Stripe Express pour recevoir leurs dépôts (gratuit, configuration en quelques minutes).
          </p>
        </div>
      </div>
    </section>
  );
}
