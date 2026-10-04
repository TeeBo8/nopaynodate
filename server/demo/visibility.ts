import { eq, or } from "drizzle-orm";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";

// Bac à sable de l'utilisateur (null pour un profil de décor ou un vrai compte)
export async function getSandboxId(userId: string): Promise<string | null> {
  const [row] = await db
    .select({ sandboxId: users.demoSandboxId })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return row?.sandboxId ?? null;
}

// En démo, un visiteur ne voit que les profils de décor et les deux comptes de son bac à sable
export function visibleInDemo(sandboxId: string | null) {
  return sandboxId
    ? or(eq(users.isSeed, true), eq(users.demoSandboxId, sandboxId))
    : eq(users.isSeed, true);
}
