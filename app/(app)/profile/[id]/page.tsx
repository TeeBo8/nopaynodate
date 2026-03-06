import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Image from "next/image";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { profiles, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { MapPin, ShieldCheck } from "lucide-react";
import { RequestButton } from "./request-button";
import { ReportButton } from "./report-button";

function getAge(birthdate: string | null | undefined): number | null {
  if (!birthdate) return null;
  const today = new Date();
  const birth = new Date(birthdate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const result = await db
    .select({
      profile: profiles,
      user: {
        id: users.id,
        name: users.name,
        city: users.city,
        bio: users.bio,
        birthdate: users.birthdate,
        gender: users.gender,
        isVerified: users.isVerified,
        premiumUntil: users.premiumUntil,
      },
    })
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(eq(users.id, id))
    .limit(1);

  if (!result[0]) notFound();

  const { profile, user } = result[0];
  const age = getAge(user.birthdate);
  const isPremium = user.premiumUntil ? new Date(user.premiumUntil) > new Date() : false;
  const isOwnProfile = session.user.id === user.id;
  const depositDisplay = `$${Math.round(profile.depositAmount / 100)}`;

  const currentUserData = await db
    .select({ gender: users.gender })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);
  const viewerGender = currentUserData[0]?.gender;
  const canRequest = !isOwnProfile && viewerGender === "man" && user.gender === "woman";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Photos gallery */}
      {profile.photos && profile.photos.length > 0 ? (
        <div className={`grid gap-2 ${profile.photos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {profile.photos.slice(0, 4).map((url, i) => (
            <div
              key={url}
              className={`relative overflow-hidden rounded-2xl bg-muted ${
                i === 0 && profile.photos.length > 1 ? "col-span-2 aspect-video" : "aspect-square"
              }`}
            >
              <Image src={url} alt={user.name} fill className="object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center text-6xl">
          👤
        </div>
      )}

      {/* Header infos */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            {age && <span className="text-muted-foreground">{age} ans</span>}
            {user.isVerified && (
              <Badge variant="secondary" className="gap-1">
                <ShieldCheck size={12} />
                Vérifié
              </Badge>
            )}
            {isPremium && (
              <Badge className="bg-amber-500 hover:bg-amber-500 text-white">Premium</Badge>
            )}
          </div>
          {user.city && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <MapPin size={13} />
              {user.city}
            </div>
          )}
        </div>

        {/* Deposit chip */}
        {user.gender === "woman" && (
          <div className="shrink-0 text-right">
            <p className="text-xs text-muted-foreground">Dépôt requis</p>
            <p className="text-2xl font-bold">{depositDisplay}</p>
          </div>
        )}
      </div>

      {user.bio && (
        <>
          <Separator />
          <p className="text-sm leading-relaxed">{user.bio}</p>
        </>
      )}

      <Separator />

      {/* CTA */}
      {isOwnProfile ? (
        <Button variant="outline" asChild>
          <Link href="/profile/edit">Modifier mon profil</Link>
        </Button>
      ) : canRequest ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-border p-4 bg-muted/30 space-y-1">
            <p className="font-medium text-sm">Comment ça fonctionne</p>
            <p className="text-xs text-muted-foreground">
              Envoyez une demande de rendez-vous avec un dépôt de{" "}
              <strong>{depositDisplay}</strong>. Si elle accepte, le chat est
              débloqué. Après le rendez-vous, le dépôt lui est transféré (moins
              10% de commission). Si elle refuse, vous êtes remboursé à 100%.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <RequestButton targetId={id} depositDisplay={depositDisplay} />
            <ReportButton reportedUserId={id} />
          </div>
        </div>
      ) : (
        !isOwnProfile && <ReportButton reportedUserId={id} />
      )}
    </div>
  );
}
