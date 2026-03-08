import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { profiles, users } from "@/server/db/schema";
import { eq, ne, and, desc, sql } from "drizzle-orm";
import { BrowseClient } from "@/components/browse-client";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

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
    .limit(60);

  return <BrowseClient results={results} gender={myGender ?? null} />;
}
