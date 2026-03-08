"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "@/lib/auth-client";
import { api } from "@/lib/trpc-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Crown, Star, Trash2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { toast } from "sonner";

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
  const [deleting, setDeleting] = useState(false);
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === "admin@example.com";

  const deleteAccount = api.users.deleteAccount.useMutation({
    onSuccess: async () => {
      toast.success("Compte supprimé.");
      await signOut();
      router.push("/");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression. Réessayez.");
      setDeleting(false);
    },
  });

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

      <div className="border border-border rounded-lg p-4 space-y-3">
        <h2 className="font-medium">Compte</h2>
        <Button variant="outline" onClick={handleSignOut}>
          Se déconnecter
        </Button>
      </div>

      {isAdmin && (
        <div className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            <h2 className="font-medium">Administration</h2>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm">Accéder au panel admin</Button>
          </Link>
        </div>
      )}

      <div className="rounded-lg border border-border p-4 space-y-1">
        <h2 className="font-medium text-sm">Support</h2>
        <p className="text-sm text-muted-foreground">
          Un problème ou une question ?{" "}
          <a href="mailto:admin@example.com" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Contactez-nous
          </a>
        </p>
      </div>

      <div className="border border-destructive/30 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 size={16} className="text-destructive" />
          <h2 className="font-medium text-destructive">Zone dangereuse</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          La suppression de votre compte est irréversible. Toutes vos données,
          photos et conversations seront définitivement effacées.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={deleting}>
              Supprimer mon compte
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer votre compte ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Votre profil, vos photos,
                vos conversations et votre abonnement seront supprimés
                définitivement.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  setDeleting(true);
                  deleteAccount.mutate();
                }}
              >
                Oui, supprimer mon compte
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
