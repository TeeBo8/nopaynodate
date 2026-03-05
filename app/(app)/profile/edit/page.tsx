"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
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
  const [photos, setPhotos] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  const isWoman = session?.user && "gender" in session.user
    ? (session.user as { gender?: string }).gender === "woman"
    : false;

  const { data: myProfile } = api.profiles.myProfile.useQuery();

  useEffect(() => {
    if (myProfile?.photos) setPhotos(myProfile.photos);
  }, [myProfile]);

  const updateUser = api.users.updateProfile.useMutation();
  const upsertProfile = api.profiles.upsert.useMutation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      bio: "",
      city: "",
      birthdate: "",
      depositAmount: 50,
    },
  });

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
    setPhotos((prev) => prev.filter((p) => p !== url));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Mon profil</h1>
        <p className="text-muted-foreground mt-1">
          Complétez votre profil pour commencer.
        </p>
      </div>

      {/* Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Photos</CardTitle>
          <CardDescription>Ajoutez jusqu&apos;à 6 photos.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {photos.map((url) => (
                <div key={url} className="relative aspect-square group">
                  <Image
                    src={url}
                    alt="Photo profil"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(url)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {photos.length < 6 && (
            <UploadButton
              endpoint="profilePhoto"
              onClientUploadComplete={(res) => {
                const urls = res.map((r) => r.url);
                setPhotos((prev) => [...prev, ...urls].slice(0, 6));
              }}
              onUploadError={(error) => console.error(error)}
              appearance={{
                button: "ut-ready:bg-foreground ut-ready:text-background",
              }}
            />
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <Input placeholder="New York" {...field} />
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
                        placeholder="Parlez de vous en quelques mots..."
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
                        <FormLabel>Montant du dépôt demandé ($)</FormLabel>
                        <FormDescription>
                          L&apos;homme devra payer ce montant avant d&apos;accéder au chat. Entre 20$ et 200$.
                        </FormDescription>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">$</span>
                            <Input
                              type="number"
                              min={20}
                              max={200}
                              placeholder="50"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="max-w-[120px]"
                            />
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
                    ? "Sauvegarde..."
                    : "Sauvegarder"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
