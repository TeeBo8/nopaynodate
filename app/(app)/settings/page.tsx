"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>

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
