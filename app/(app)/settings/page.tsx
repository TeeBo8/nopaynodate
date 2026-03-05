"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { api } from "@/lib/trpc-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Star } from "lucide-react";
import { Suspense } from "react";

function PremiumSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justSubscribed = searchParams.get("premium") === "success";

  const { data: status } = api.subscriptions.getStatus.useQuery();
  const createCheckout = api.subscriptions.createCheckoutSession.useMutation({
    onSuccess: (data) => { if (data.url) window.location.href = data.url; },
  });
  const createPortal = api.subscriptions.createPortalSession.useMutation({
    onSuccess: (data) => { if (data.url) window.location.href = data.url; },
  });

  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Crown size={18} className="text-yellow-500" />
        <h2 className="font-medium">Premium</h2>
        {status?.isPremium && (
          <Badge variant="secondary" className="text-yellow-600 bg-yellow-50 border-yellow-200">
            Actif
          </Badge>
        )}
      </div>

      {justSubscribed && (
        <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          Bienvenue dans le club Premium !
        </p>
      )}

      {status?.isPremium ? (
        <>
          <p className="text-sm text-muted-foreground">
            Votre abonnement est actif jusqu&apos;au{" "}
            <span className="font-medium text-foreground">
              {status.premiumUntil
                ? new Date(status.premiumUntil).toLocaleDateString("fr-FR")
                : "—"}
            </span>
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-1.5"><Star size={13} className="text-yellow-500" /> Badge Premium visible sur votre profil</li>
            <li className="flex items-center gap-1.5"><Star size={13} className="text-yellow-500" /> Profil mis en avant dans la recherche</li>
          </ul>
          <Button
            variant="outline"
            size="sm"
            onClick={() => createPortal.mutate()}
            disabled={createPortal.isPending}
          >
            {createPortal.isPending ? "Chargement..." : "Gérer mon abonnement"}
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Passez Premium pour booster votre visibilité et afficher un badge exclusif.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-1.5"><Star size={13} className="text-yellow-500" /> Badge Premium visible sur votre profil</li>
            <li className="flex items-center gap-1.5"><Star size={13} className="text-yellow-500" /> Profil mis en avant dans la recherche</li>
          </ul>
          <Button
            onClick={() => createCheckout.mutate()}
            disabled={createCheckout.isPending}
            className="gap-2"
          >
            <Crown size={15} />
            {createCheckout.isPending ? "Chargement..." : "Passer Premium — 19,99$/mois"}
          </Button>
        </>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <Suspense fallback={<div className="border border-border rounded-lg p-4 h-32 animate-pulse bg-muted/30" />}>
        <PremiumSection />
      </Suspense>

      <div className="border border-border rounded-lg p-4 space-y-2">
        <h2 className="font-medium">Compte</h2>
        <p className="text-sm text-muted-foreground">
          Gérez votre compte et vos préférences.
        </p>
        <Button variant="destructive" onClick={handleSignOut}>
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
