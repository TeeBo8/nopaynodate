"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/trpc-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, CreditCard, UserCheck, Banknote, ArrowRight, Lock } from "lucide-react";

const STEPS = [
  {
    icon: UserCheck,
    title: "Créez votre compte Stripe",
    desc: "Stripe vous demandera votre nom, email et numéro de téléphone. C'est rapide — moins de 2 minutes.",
  },
  {
    icon: CreditCard,
    title: "Vérifiez votre identité",
    desc: "Stripe est une plateforme financière réglementée. Une pièce d'identité (passeport, CNI) est requise par la loi pour recevoir des paiements.",
  },
  {
    icon: Banknote,
    title: "Ajoutez votre RIB / IBAN",
    desc: "Renseignez votre compte bancaire. Les virements arrivent automatiquement après chaque rendez-vous confirmé.",
  },
];

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  const { data: session } = useSession();

  const createAccount = api.deposits.createConnectedAccount.useMutation({
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  if (session?.user?.gender !== "woman") {
    return (
      <div className="max-w-md mx-auto">
        <p className="text-muted-foreground">Cette page est réservée aux femmes.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto space-y-6 py-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Compte configuré !</h1>
            <p className="mt-2 text-muted-foreground">
              Votre compte Stripe Express est en cours de vérification par Stripe (généralement quelques minutes).
              Une fois validé, vous pourrez accepter des demandes et recevoir vos dépôts directement sur votre compte bancaire.
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-5 text-left space-y-2">
            <p className="text-sm font-semibold">Ce qui se passe maintenant :</p>
            {[
              "Stripe vérifie votre identité (quelques minutes à quelques heures)",
              "Une fois validé, vous recevrez 90% de chaque dépôt après un rendez-vous confirmé",
              "Les virements sont automatiques — vous n'avez rien à faire",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
        <Button asChild className="w-full">
          <Link href="/profile/edit">Retour à mon profil <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Recevoir mes dépôts</h1>
        <p className="mt-1 text-muted-foreground">
          Pour recevoir les paiements des hommes qui vous contactent, vous devez connecter votre compte bancaire via <strong>Stripe</strong> — la plateforme de paiement utilisée par des millions d&apos;entreprises (Amazon, Shopify, Uber…).
        </p>
      </div>

      {/* Pourquoi c'est nécessaire */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Pourquoi Stripe ?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Stripe gère les paiements de façon sécurisée et légale. Vos coordonnées bancaires ne sont jamais partagées avec NoPayNoDate ni avec les hommes de la plateforme. Stripe est certifié PCI-DSS (la norme de sécurité bancaire la plus élevée).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Les 3 étapes */}
      <div>
        <p className="text-sm font-semibold text-foreground mb-3">Les 3 étapes de configuration (~5 min)</p>
        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-4 rounded-xl border border-border/60 bg-muted/20 px-4 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-sm">{step.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ce qu'il vous faut */}
      <Card>
        <CardContent className="p-5">
          <p className="text-sm font-semibold mb-2">Préparez ces informations :</p>
          <ul className="space-y-1.5">
            {[
              "Votre email",
              "Votre numéro de téléphone",
              "Une pièce d'identité (CNI, passeport ou permis de conduire)",
              "Votre IBAN / RIB bancaire",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="space-y-3">
        <Button
          onClick={() => createAccount.mutate()}
          disabled={createAccount.isPending}
          className="w-full h-12 text-base"
          size="lg"
        >
          {createAccount.isPending
            ? "Redirection vers Stripe..."
            : "Connecter mon compte bancaire"}
          {!createAccount.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          Vous serez redirigée vers le site sécurisé de Stripe. NoPayNoDate ne voit jamais vos données bancaires.
        </p>
      </div>
    </div>
  );
}
