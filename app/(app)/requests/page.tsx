"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/trpc-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";

const STATUS_LABELS: Record<
  string,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  pending: { label: "En attente de paiement", variant: "outline" },
  paid: { label: "En attente de réponse", variant: "secondary" },
  accepted: { label: "Acceptée", variant: "default" },
  rejected: { label: "Rejetée", variant: "destructive" },
  completed: { label: "Terminée", variant: "secondary" },
  refunded: { label: "Remboursée", variant: "outline" },
};

function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${Math.floor(hours / 24)}j`;
}

export default function RequestsPage() {
  const { data: session } = useSession();
  const isWoman = session?.user?.gender === "woman";

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

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">
        {isWoman ? "Demandes reçues" : "Mes demandes"}
      </h1>

      {!requests?.length ? (
        <p className="text-muted-foreground text-sm">
          Aucune demande pour le moment.
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
                      Dépôt : ${(depositAmount / 100).toFixed(0)}
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
                          Payer le dépôt
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
                          disabled={acceptRequest.isPending}
                        >
                          Accepter
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            rejectRequest.mutate({ requestId: req.id })
                          }
                          disabled={rejectRequest.isPending}
                        >
                          Rejeter
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
                              ? "Les deux ont confirmé ✓"
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
                          Confirmer le rendez-vous
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
