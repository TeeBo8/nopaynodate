"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc-react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export function RequestButton({
  targetId,
  depositDisplay,
}: {
  targetId: string;
  depositDisplay: string;
}) {
  const router = useRouter();

  const sendRequest = api.requests.send.useMutation({
    onSuccess: (data) => {
      router.push(`/payments/deposit/${data.id}`);
    },
  });

  return (
    <Button
      className="w-full gap-2"
      size="lg"
      onClick={() => sendRequest.mutate({ targetId })}
      disabled={sendRequest.isPending}
    >
      <Heart size={16} />
      {sendRequest.isPending
        ? "Création..."
        : `Demander un rendez-vous — ${depositDisplay}`}
    </Button>
  );
}
