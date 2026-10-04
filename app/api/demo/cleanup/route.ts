import { isDemo } from "@/lib/demo";
import { deleteExpiredSandboxes } from "@/server/demo/sandbox";

// Nettoyage quotidien des bacs à sable expirés, appelé par la tâche planifiée Vercel (vercel.json).
// Vercel envoie « Authorization: Bearer <CRON_SECRET> » ; sans secret configuré, la route refuse tout.
export async function GET(req: Request) {
  if (!isDemo) return new Response(null, { status: 404 });

  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response(null, { status: 401 });
  }

  const deleted = await deleteExpiredSandboxes();
  return Response.json({ deleted });
}
