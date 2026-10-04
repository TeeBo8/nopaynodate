"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/trpc-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, AlertCircle } from "lucide-react";

const STATUS_LABELS: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "Awaiting payment", variant: "outline" },
  paid: { label: "Awaiting response", variant: "secondary" },
  accepted: { label: "Accepted", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  completed: { label: "Completed", variant: "secondary" },
  refunded: { label: "Refunded", variant: "outline" },
};

function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function RequestsPage() {
  const { data: session } = useSession();
  const isWoman = session?.user?.gender === "woman";

  const { data: me } = api.users.me.useQuery();
  const hasStripeAccount = !!me?.stripeAccountId;

  const { data: requests, refetch } = api.requests.myRequests.useQuery();
  const acceptRequest = api.requests.accept.useMutation({
    onSuccess: () => refetch(),
  });
  const rejectRequest = api.requests.reject.useMutation({
    onSuccess: () => refetch(),
  });
  const confirmDate = api.requests.confirm.useMutation({
    onSuccess: () => refetch(),
  });

  // Retour du formulaire Stripe : l'adresse contient l'identifiant du paiement.
  // On le fait vérifier par le serveur, sans attendre le webhook.
  const syncPayment = api.deposits.syncPayment.useMutation({
    onSuccess: () => refetch(),
  });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentIntentId = params.get("payment_intent");
    if (!paymentIntentId) return;
    window.history.replaceState(null, "", "/requests");
    if (params.get("redirect_status") === "succeeded") syncPayment.mutate({ paymentIntentId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">
        {isWoman ? "Received requests" : "My requests"}
      </h1>

      {/* Alerte Stripe Express manquant — femmes uniquement */}
      {isWoman && !hasStripeAccount && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-300">
              Stripe Express account required to receive payments
            </p>
            <p className="mt-0.5 text-amber-700 dark:text-amber-400">
              Set up your bank account to accept requests and receive your deposits.
            </p>
            <Button size="sm" className="mt-2" asChild>
              <Link href="/payments/onboarding">Set up my account →</Link>
            </Button>
          </div>
        </div>
      )}

      {!requests?.length ? (
        <p className="text-muted-foreground text-sm">
          No requests yet.
        </p>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const otherUser = isWoman ? (req as any).requester : (req as any).target;
            const photo = otherUser?.profile?.photos?.[0];
            const depositAmount = otherUser?.profile?.depositAmount;
            const status = STATUS_LABELS[req.status] ?? {
              label: req.status,
              variant: "outline" as const,
            };

            return (
              <div
                key={req.id}
                className="border border-border rounded-xl p-4 flex items-start gap-4"
              >
                {/* Avatar */}
                <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  {photo ? (
                    <Image
                      src={photo}
                      alt={otherUser?.name ?? ""}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold text-xl">
                      {otherUser?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{otherUser?.name}</span>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>

                  {depositAmount && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Deposit: ${(depositAmount / 100).toFixed(0)}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground">
                    {timeAgo(req.createdAt)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 flex-wrap items-center">
                    {/* Chat : accessible si paid, accepted, ou completed */}
                    {["paid", "accepted", "completed"].includes(req.status) && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/chat/${req.id}`}>
                          <MessageCircle size={14} className="mr-1" />
                          Chat
                        </Link>
                      </Button>
                    )}

                    {/* Homme : payer si pending */}
                    {!isWoman && req.status === "pending" && (
                      <Button size="sm" asChild>
                        <Link href={`/payments/deposit/${req.id}`}>
                          Pay deposit
                        </Link>
                      </Button>
                    )}

                    {/* Femme : accepter / rejeter si paid */}
                    {isWoman && req.status === "paid" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            acceptRequest.mutate({ requestId: req.id })
                          }
                          disabled={acceptRequest.isPending || !hasStripeAccount}
                          title={!hasStripeAccount ? "Set up your Stripe Express account first" : undefined}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            rejectRequest.mutate({ requestId: req.id })
                          }
                          disabled={rejectRequest.isPending}
                        >
                          Reject
                        </Button>
                      </>
                    )}

                    {/* Les deux : confirmer si accepted */}
                    {req.status === "accepted" && (() => {
                      const hasConfirmed = isWoman
                        ? req.targetConfirmed
                        : req.requesterConfirmed;
                      const otherConfirmed = isWoman
                        ? req.requesterConfirmed
                        : req.targetConfirmed;

                      if (hasConfirmed) {
                        return (
                          <p className="text-xs text-muted-foreground">
                            {otherConfirmed
                              ? "Both confirmed ✓"
                              : "Confirmation envoyée — en attente de l'autre partie"}
                          </p>
                        );
                      }
                      return (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            confirmDate.mutate({ requestId: req.id })
                          }
                          disabled={confirmDate.isPending}
                        >
                          Confirm the date
                        </Button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
