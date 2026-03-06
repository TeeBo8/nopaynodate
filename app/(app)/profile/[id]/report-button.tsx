"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/trpc-react";
import { toast } from "sonner";

const REASONS = [
  { value: "spam", label: "Spam ou arnaque" },
  { value: "fake_profile", label: "Faux profil" },
  { value: "inappropriate", label: "Contenu inapproprié" },
  { value: "other", label: "Autre" },
] as const;

export function ReportButton({ reportedUserId }: { reportedUserId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");

  const report = api.users.reportUser.useMutation({
    onSuccess: () => {
      toast.success("Signalement envoyé. Merci !");
      setOpen(false);
      setReason("");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
          <Flag size={14} />
          Signaler
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Signaler ce profil</DialogTitle>
          <DialogDescription>
            Votre signalement sera examiné par notre équipe.
          </DialogDescription>
        </DialogHeader>
        <Select value={reason} onValueChange={setReason}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une raison..." />
          </SelectTrigger>
          <SelectContent>
            {REASONS.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            disabled={!reason || report.isPending}
            onClick={() =>
              report.mutate({
                reportedUserId,
                reason: reason as "spam" | "fake_profile" | "inappropriate" | "other",
              })
            }
          >
            {report.isPending ? "Envoi..." : "Envoyer le signalement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
