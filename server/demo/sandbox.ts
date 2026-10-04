import { createHmac } from "node:crypto";
import { and, eq, gt, isNotNull, lt, ne, count, countDistinct } from "drizzle-orm";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { users, profiles, sessions } from "@/server/db/schema";
import { generateId } from "@/lib/utils";
import {
  DEMO_EMAIL_DOMAIN,
  DEMO_MAX_ACTIVE_SANDBOXES,
  DEMO_MAX_SANDBOXES_PER_IP_PER_HOUR,
  DEMO_PERSONAS,
  DEMO_SANDBOX_TTL_HOURS,
} from "@/lib/demo";

// Mot de passe d'un compte de démo : dérivé de son email avec le secret du serveur.
// Rien n'est stocké, et personne ne peut le recalculer sans BETTER_AUTH_SECRET.
function demoPassword(email: string): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("BETTER_AUTH_SECRET is missing");
  return createHmac("sha256", secret).update(email).digest("hex");
}

function demoEmail(slug: string, sandboxId: string): string {
  return `${slug}-${sandboxId}@${DEMO_EMAIL_DOMAIN}`;
}

export async function isDemoFull(): Promise<boolean> {
  const [row] = await db.select({ n: count() }).from(users).where(isNotNull(users.demoSandboxId));
  return (row?.n ?? 0) >= DEMO_MAX_ACTIVE_SANDBOXES * 2;
}

// Limite par adresse IP : nombre de bacs à sable ouverts depuis cette adresse sur la dernière heure.
// L'adresse est celle que Better Auth enregistre sur chaque session (en-tête x-forwarded-for).
// Sans adresse lisible, la limite ne s'applique pas : le plafond global reste le filet de sécurité.
export async function isIpOverLimit(headers: Headers): Promise<boolean> {
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return false;

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const [row] = await db
    .select({ n: countDistinct(users.demoSandboxId) })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.ipAddress, ip),
        gt(sessions.createdAt, oneHourAgo),
        isNotNull(users.demoSandboxId)
      )
    );
  return (row?.n ?? 0) >= DEMO_MAX_SANDBOXES_PER_IP_PER_HOUR;
}

// Supprime les bacs à sable expirés. Les suppressions en cascade emportent sessions, profils,
// demandes, dépôts et messages. Renvoie le nombre de comptes supprimés.
export async function deleteExpiredSandboxes(): Promise<number> {
  const cutoff = new Date(Date.now() - DEMO_SANDBOX_TTL_HOURS * 60 * 60 * 1000);
  const deleted = await db
    .delete(users)
    .where(and(isNotNull(users.demoSandboxId), lt(users.createdAt, cutoff)))
    .returning({ id: users.id });
  return deleted.length;
}

// Crée la paire de comptes d'un visiteur (un homme, une femme) et renvoie l'email du compte homme.
export async function createSandbox(headers: Headers): Promise<string> {
  const sandboxId = generateId();

  for (const gender of ["man", "woman"] as const) {
    const persona = DEMO_PERSONAS[gender];
    const email = demoEmail(persona.slug, sandboxId);
    const { user } = await auth.api.signUpEmail({
      body: {
        email,
        password: demoPassword(email),
        name: persona.name,
        gender,
        birthdate: persona.birthdate,
        city: persona.city,
        bio: persona.bio,
      },
      // Transmis pour que la session ouverte à l'inscription porte l'adresse IP du visiteur
      headers,
    });
    await db
      .update(users)
      .set({
        demoSandboxId: sandboxId,
        emailVerified: true,
        // Le versement Connect est simulé en démo : la femme est créée « déjà connectée »
        ...(gender === "woman" && {
          stripeAccountId: `acct_demo_${sandboxId}`,
          isStripeVerified: true,
        }),
      })
      .where(eq(users.id, user.id));
    await db.insert(profiles).values({
      id: generateId(),
      userId: user.id,
      photos: [`/demo/avatars/${persona.slug}.svg`],
    });
  }

  return demoEmail(DEMO_PERSONAS.man.slug, sandboxId);
}

// Email de l'autre compte du même bac à sable (null si l'utilisateur n'est pas un compte de démo)
export async function getOtherSandboxEmail(userId: string): Promise<string | null> {
  const [me] = await db
    .select({ sandboxId: users.demoSandboxId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!me?.sandboxId) return null;

  const [other] = await db
    .select({ email: users.email })
    .from(users)
    .where(and(eq(users.demoSandboxId, me.sandboxId), ne(users.id, userId)))
    .limit(1);
  return other?.email ?? null;
}

// Ouvre une session pour un compte de démo et renvoie les cookies à poser sur la réponse
export async function signInDemoUser(email: string, headers: Headers): Promise<string[]> {
  const response = await auth.api.signInEmail({
    body: { email, password: demoPassword(email) },
    headers,
    asResponse: true,
  });
  if (!response.ok) throw new Error(`Demo sign-in refused (${response.status})`);
  return response.headers.getSetCookie();
}
