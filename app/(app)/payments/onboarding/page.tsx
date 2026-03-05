"use client";

import { useSearchParams } from "next/navigation";
import { api } from "@/lib/trpc-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, ShieldCheck } from "lucide-react";

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
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              Configuration terminée
            </CardTitle>
            <CardDescription>
              Votre compte de paiement est en cours de vérification. Vous
              recevrez les fonds après chaque rendez-vous confirmé.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configurer mes paiements</h1>
        <p className="text-muted-foreground mt-1">
          Connectez votre compte bancaire pour recevoir les dépôts.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck size={18} />
            Stripe Express
          </CardTitle>
          <CardDescription>
            Vous recevrez 90% du dépôt après chaque rendez-vous confirmé. La
            plateforme conserve 10% de commission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => createAccount.mutate()}
            disabled={createAccount.isPending}
            className="w-full"
          >
            {createAccount.isPending ? "Redirection..." : "Configurer mon compte"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
