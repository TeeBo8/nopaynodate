"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Étape 1 — Credentials
const step1Schema = z.object({
  name: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Minimum 8 caractères"),
});

type Step1Values = z.infer<typeof step1Schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<Step1Values | null>(null);
  const [selectedGender, setSelectedGender] = useState<"man" | "woman" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleStep1 = (values: Step1Values) => {
    setStep1Data(values);
    setStep(2);
  };

  const handleStep2 = async () => {
    if (!selectedGender || !step1Data) return;
    setLoading(true);
    setError(null);

    const result = await signUp.email({
      name: step1Data.name,
      email: step1Data.email,
      password: step1Data.password,
      // @ts-expect-error - champs additionnels Better Auth
      gender: selectedGender,
    });

    setLoading(false);

    if (result.error) {
      setError(result.error.message ?? "Erreur lors de la création du compte.");
      setStep(1);
      return;
    }

    router.push("/profile/edit");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Créer un compte</CardTitle>
        <CardDescription>
          {step === 1 ? "Étape 1 sur 2 — Vos informations" : "Étape 2 sur 2 — Qui êtes-vous ?"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {step === 1 ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleStep1)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Votre prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="vous@exemple.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Minimum 8 caractères" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Continuer
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground text-center">
              Cette information détermine votre rôle sur la plateforme.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedGender("woman")}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:border-foreground",
                  selectedGender === "woman"
                    ? "border-foreground bg-foreground/5"
                    : "border-border"
                )}
              >
                <span className="text-4xl">👩</span>
                <div className="text-center">
                  <p className="font-semibold">Femme</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vous fixez le montant du dépôt
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedGender("man")}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:border-foreground",
                  selectedGender === "man"
                    ? "border-foreground bg-foreground/5"
                    : "border-border"
                )}
              >
                <span className="text-4xl">👨</span>
                <div className="text-center">
                  <p className="font-semibold">Homme</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Vous payez un dépôt pour obtenir un rendez-vous
                  </p>
                </div>
              </button>
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button
              onClick={handleStep2}
              className="w-full"
              disabled={!selectedGender || loading}
            >
              {loading ? "Création du compte..." : "Créer mon compte"}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Retour
            </Button>
          </div>
        )}
      </CardContent>

      {step === 1 && (
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-foreground underline underline-offset-4">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      )}
    </Card>
  );
}
