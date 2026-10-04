import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { isDemo } from "@/lib/demo";
import { isSameOrigin, redirectTo } from "@/server/demo/http";
import { createSandbox, isDemoFull, isIpOverLimit, signInDemoUser } from "@/server/demo/sandbox";

// Entrée dans la démo : crée la paire de comptes du visiteur et le connecte côté homme
export async function POST(req: Request) {
  if (!isDemo) return new NextResponse(null, { status: 404 });
  if (!isSameOrigin(req)) return new NextResponse(null, { status: 403 });

  // Le visiteur a déjà un bac à sable ouvert : on le réutilise
  const session = await auth.api.getSession({ headers: req.headers });
  if (session) return redirectTo(req, "/browse");

  if ((await isDemoFull()) || (await isIpOverLimit(req.headers))) {
    return redirectTo(req, "/login?full=1");
  }

  const email = await createSandbox();
  const cookies = await signInDemoUser(email, req.headers);
  return redirectTo(req, "/browse", cookies);
}
