"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth-client";
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
import { isDemo } from "@/lib/demo";

function PremiumSection() {
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
            Active
          </Badge>
        )}
      </div>

      {justSubscribed && (
        <p className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md px-3 py-2">
          Welcome to the Premium club!
        </p>
      )}

      {status?.isPremium ? (
        <>
          <p className="text-sm text-muted-foreground">
            Your subscription is active until{" "}
            <span className="font-medium text-foreground">
              {status.premiumUntil
                ? new Date(status.premiumUntil).toLocaleDateString("en-US")
                : "—"}
            </span>
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-1.5"><Star size={13} className="text-yellow-500" /> Premium badge visible on your profile</li>
            <li className="flex items-center gap-1.5"><Star size={13} className="text-yellow-500" /> Profile boosted in search results</li>
          </ul>
          <Button
            variant="outline"
            size="sm"
            onClick={() => createPortal.mutate()}
            disabled={createPortal.isPending}
          >
            {createPortal.isPending ? "Loading..." : "Manage subscription"}
          </Button>
        </>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Go Premium to boost your visibility and display an exclusive badge.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center gap-1.5"><Star size={13} className="text-yellow-500" /> Premium badge visible on your profile</li>
            <li className="flex items-center gap-1.5"><Star size={13} className="text-yellow-500" /> Profile boosted in search results</li>
          </ul>
          <Button
            onClick={() => createCheckout.mutate()}
            disabled={createCheckout.isPending}
            className="gap-2"
          >
            <Crown size={15} />
            {createCheckout.isPending ? "Loading..." : "Go Premium — $19.99/month"}
          </Button>
        </>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const { data: isAdmin } = api.users.isAdmin.useQuery();

  const deleteAccount = api.users.deleteAccount.useMutation({
    onSuccess: async () => {
      toast.success("Account deleted.");
      await signOut();
      router.push("/");
    },
    onError: () => {
      toast.error("Deletion error. Please try again.");
      setDeleting(false);
    },
  });

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {isDemo ? (
        <div className="border border-border rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-yellow-500" />
            <h2 className="font-medium">Premium</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            The Premium subscription (Stripe Billing) is switched off in the demo. Premium profiles
            in Discover show what the badge and the boost look like.
          </p>
        </div>
      ) : (
        <Suspense fallback={<div className="border border-border rounded-lg p-4 h-32 animate-pulse bg-muted/30" />}>
          <PremiumSection />
        </Suspense>
      )}

      <div className="border border-border rounded-lg p-4 space-y-3">
        <h2 className="font-medium">Account</h2>
        <Button variant="outline" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>

      {isAdmin && (
        <div className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            <h2 className="font-medium">Administration</h2>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm">Access admin panel</Button>
          </Link>
        </div>
      )}

      <div className="rounded-lg border border-border p-4 space-y-1">
        <h2 className="font-medium text-sm">Support</h2>
        <p className="text-sm text-muted-foreground">
          A problem or question?{" "}
          <a href="mailto:contact@teebostudio.fr" className="underline underline-offset-4 hover:text-foreground transition-colors">
            Contact us
          </a>
        </p>
      </div>

      {isDemo && (
        <p className="text-sm text-muted-foreground">
          Your two demo accounts are deleted automatically after 24 hours.
        </p>
      )}

      <div hidden={isDemo} className="border border-destructive/30 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 size={16} className="text-destructive" />
          <h2 className="font-medium text-destructive">Danger zone</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Deleting your account is irreversible. All your data,
          photos and conversations will be permanently erased.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={deleting}>
              Delete my account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This action is irreversible. Your profile, photos,
                conversations and subscription will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  setDeleting(true);
                  deleteAccount.mutate();
                }}
              >
                Yes, delete my account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
