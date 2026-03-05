import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { profiles, users } from "@/server/db/schema";
import { eq, ne, and, desc, sql } from "drizzle-orm";
import { ProfileCard } from "@/components/profile-card";
import { Search } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const currentUser = await db
    .select({ gender: users.gender })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const myGender = currentUser[0]?.gender;
  const targetGender = myGender === "man" ? "woman" : "man";

  const results = await db
    .select({
      profile: profiles,
      user: {
        id: users.id,
        name: users.name,
        city: users.city,
        bio: users.bio,
        birthdate: users.birthdate,
        isVerified: users.isVerified,
        premiumUntil: users.premiumUntil,
      },
    })
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(
      and(
        eq(profiles.isActive, true),
        eq(users.gender, targetGender),
        ne(users.id, session.user.id)
      )
    )
    .orderBy(
      desc(sql`CASE WHEN ${users.premiumUntil} > NOW() THEN 1 ELSE 0 END`),
      desc(profiles.lastActive)
    )
    .limit(40);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Découvrir</h1>
        <p className="text-muted-foreground mt-1">
          {results.length > 0
            ? `${results.length} profil${results.length > 1 ? "s" : ""} disponible${results.length > 1 ? "s" : ""}`
            : "Aucun profil pour le moment."}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <Search size={40} className="text-muted-foreground" />
          <div>
            <p className="font-medium">Aucun profil disponible</p>
            <p className="text-sm text-muted-foreground mt-1">
              Revenez plus tard, de nouveaux profils arrivent chaque jour.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map(({ profile, user }) => (
            <ProfileCard
              key={user.id}
              userId={user.id}
              name={user.name}
              city={user.city}
              bio={user.bio}
              birthdate={user.birthdate}
              photos={profile.photos ?? []}
              depositAmount={profile.depositAmount}
              isVerified={user.isVerified}
              isPremium={
                user.premiumUntil ? new Date(user.premiumUntil) > new Date() : false
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
