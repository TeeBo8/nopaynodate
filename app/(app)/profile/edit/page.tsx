"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/trpc-react";
import { useSession } from "@/lib/auth-client";
import { UploadButton } from "@/lib/uploadthing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X, Plus, CheckCircle2, AlertCircle, Camera, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  name: z.string().min(2, "Minimum 2 caractères"),
  bio: z.string().max(500, "Maximum 500 caractères").optional(),
  city: z.string().max(100).optional(),
  birthdate: z.string().optional(),
  depositAmount: z.number().min(20).max(200).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileEditPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);

  const isWoman = session?.user?.gender === "woman";

  const { data: myProfile } = api.profiles.myProfile.useQuery();
  const { data: me } = api.users.me.useQuery();
  const hasStripeAccount = !!me?.stripeAccountId;

  const serverPhotos = myProfile?.photos ?? [];
  const [photosOverride, setPhotosOverride] = useState<string[] | null>(null);
  const photos = photosOverride ?? serverPhotos;

  const updateUser = api.users.updateProfile.useMutation();
  const upsertProfile = api.profiles.upsert.useMutation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      bio: me?.bio ?? "",
      city: me?.city ?? "",
      birthdate: me?.birthdate ?? "",
      depositAmount: myProfile?.depositAmount ? myProfile.depositAmount / 100 : 50,
    },
  });

  const depositAmount = form.watch("depositAmount") ?? 50;

  const onSubmit = async (values: ProfileFormValues) => {
    setSaved(false);
    await updateUser.mutateAsync({
      name: values.name,
      bio: values.bio,
      city: values.city,
      birthdate: values.birthdate,
    });
    await upsertProfile.mutateAsync({
      photos,
      depositAmount: isWoman ? (values.depositAmount ?? 50) * 100 : undefined,
    });
    setSaved(true);
    setTimeout(() => router.push("/browse"), 800);
  };

  const removePhoto = (url: string) => {
    setPhotosOverride((prev) => (prev ?? serverPhotos).filter((p) => p !== url));
  };

  // Calcul du taux de complétion du profil
  const completionItems = [
    { label: "Photo de profil", done: photos.length > 0 },
    { label: "Prénom", done: !!form.watch("name") },
    { label: "Ville", done: !!form.watch("city") },
    { label: "Bio", done: (form.watch("bio")?.length ?? 0) > 10 },
    ...(isWoman ? [
      { label: "Montant du dépôt", done: true },
      { label: "Compte Stripe Express", done: hasStripeAccount },
    ] : []),
  ];
  const completionPct = Math.round((completionItems.filter((i) => i.done).length / completionItems.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold">Mon profil</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Un profil complet augmente significativement vos chances de match.
        </p>
      </div>

      {/* Barre de complétion */}
      <div className="rounded-xl border border-border/60 bg-muted/30 px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Complétion du profil</span>
          <span className={cn(
            "text-sm font-bold",
            completionPct === 100 ? "text-green-600 dark:text-green-400" : "text-primary"
          )}>{completionPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              completionPct === 100 ? "bg-green-500" : "bg-primary"
            )}
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {completionItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs">
              <CheckCircle2 className={cn(
                "h-3.5 w-3.5 shrink-0",
                item.done ? "text-green-500" : "text-muted-foreground/40"
              )} />
              <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Photos */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Photos</CardTitle>
          </div>
          <CardDescription>
            Ajoutez jusqu&apos;à 6 photos · Max 8 MB par photo · Formats : JPG, PNG, WEBP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {photos.map((url, idx) => (
              <div key={url} className="relative aspect-square group">
                <Image
                  src={url}
                  alt="Photo profil"
                  fill
                  className="object-cover rounded-xl"
                />
                {idx === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] text-white font-medium">
                    Principale
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
            {photos.length < 6 && (
              <UploadButton
                endpoint="profilePhoto"
                onClientUploadComplete={(res) => {
                  const urls = res.map((r) => r.url);
                  setPhotosOverride((prev) => [...(prev ?? serverPhotos), ...urls].slice(0, 6));
                }}
                onUploadError={(error) => console.error(error)}
                appearance={{
                  container: "aspect-square w-full",
                  button:
                    "w-full h-full rounded-xl border-2 border-dashed border-border bg-muted/40 hover:bg-muted hover:border-primary/40 transition-colors flex flex-col items-center justify-center gap-1 text-muted-foreground ut-ready:bg-muted/40 ut-uploading:bg-muted",
                  allowedContent: "hidden",
                }}
                content={{
                  button: (
                    <span className="flex flex-col items-center gap-1.5">
                      <Plus size={22} />
                      <span className="text-xs font-medium">Ajouter</span>
                    </span>
                  ),
                }}
              />
            )}
            {/* Slots vides pour visualiser la grille */}
            {Array.from({ length: Math.max(0, 6 - photos.length - 1) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="aspect-square rounded-xl border border-dashed border-border/40 bg-muted/20"
              />
            ))}
          </div>
          {photos.length === 0 && (
            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              Au moins une photo est nécessaire pour apparaître dans le browse.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Infos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ville</FormLabel>
                      <FormControl>
                        <Input placeholder="Paris, Lyon, NYC…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date de naissance</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Parlez de vous en quelques mots…"
                        className="resize-none"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {(field.value?.length ?? 0)}/500 caractères
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Deposit amount — femmes uniquement */}
              {isWoman && (
                <>
                  <Separator />
                  <FormField
                    control={form.control}
                    name="depositAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Montant du dépôt demandé</FormLabel>
                        <FormDescription>
                          L&apos;homme devra payer ce montant avant d&apos;accéder au chat.
                          Plus le montant est élevé, plus vous filtrez les profils peu sérieux.
                        </FormDescription>
                        <FormControl>
                          <div className="space-y-4 pt-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">20$</span>
                              <div className="rounded-lg bg-primary/10 px-4 py-1.5 text-lg font-bold text-primary">
                                {depositAmount}$
                              </div>
                              <span className="text-xs text-muted-foreground">200$</span>
                            </div>
                            <Slider
                              min={20}
                              max={200}
                              step={5}
                              value={[field.value ?? 50]}
                              onValueChange={(vals) => field.onChange(vals[0])}
                              className="w-full"
                            />
                            <div className="flex gap-2">
                              {[20, 50, 80, 100, 150, 200].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => field.onChange(preset)}
                                  className={cn(
                                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                                    field.value === preset
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                                  )}
                                >
                                  {preset}$
                                </button>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={updateUser.isPending || upsertProfile.isPending}
                  className={cn(saved && "bg-green-600 hover:bg-green-600")}
                >
                  {saved
                    ? "Sauvegardé !"
                    : updateUser.isPending || upsertProfile.isPending
                    ? "Sauvegarde…"
                    : "Sauvegarder le profil"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Stripe Express — femmes uniquement */}
      {isWoman && (
        <Card className={cn(
          "border-2",
          hasStripeAccount
            ? "border-green-200 dark:border-green-800"
            : "border-amber-200 dark:border-amber-800"
        )}>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                hasStripeAccount
                  ? "bg-green-100 dark:bg-green-900/30"
                  : "bg-amber-100 dark:bg-amber-900/30"
              )}>
                <Landmark className={cn(
                  "h-5 w-5",
                  hasStripeAccount ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                )} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Compte Stripe Express</span>
                  {hasStripeAccount && (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3" /> Configuré
                    </span>
                  )}
                </div>
                {hasStripeAccount ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Votre compte bancaire est prêt à recevoir les dépôts. Les virements arrivent automatiquement après chaque date confirmée (moins 10% de commission).
                  </p>
                ) : (
                  <>
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                      Requis pour recevoir les dépôts. Configuration rapide (~5 min), vérification d&apos;identité légale via Stripe.
                    </p>
                    <Button size="sm" className="mt-3" asChild>
                      <Link href="/payments/onboarding">
                        Configurer mon compte →
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
