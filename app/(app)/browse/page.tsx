import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { profiles, users } from "@/server/db/schema";
import { eq, ne, and, desc, sql } from "drizzle-orm";
import { BrowseClient } from "@/components/browse-client";
import { isDemo } from "@/lib/demo";
import { visibleInDemo } from "@/server/demo/visibility";

export const dynamic = "force-dynamic";

export default async function BrowsePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const currentUser = await db
    .select({ gender: users.gender, sandboxId: users.demoSandboxId })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  const myGender = currentUser[0]?.gender;
  const targetGender = myGender === "man" ? "woman" : "man";
  const sandboxId = currentUser[0]?.sandboxId ?? null;

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
      sandboxId: users.demoSandboxId,
    })
    .from(profiles)
    .innerJoin(users, eq(profiles.userId, users.id))
    .where(
      and(
        eq(profiles.isActive, true),
        eq(users.gender, targetGender),
        ne(users.id, session.user.id),
        isDemo ? visibleInDemo(sandboxId) : undefined
      )
    )
    .orderBy(
      desc(sql`CASE WHEN ${users.premiumUntil} > NOW() THEN 1 ELSE 0 END`),
      desc(profiles.lastActive)
    )
    .limit(60);

  // Démo : l'autre compte du visiteur est épinglé en tête de liste.
  // L'identifiant de bac à sable ne part pas vers le navigateur.
  const pinnedUserId = results.find((r) => r.sandboxId !== null)?.user.id ?? null;
  const cards = results.map(({ profile, user }) => ({ profile, user }));

  return <BrowseClient results={cards} gender={myGender ?? null} pinnedUserId={pinnedUserId} />;
}
