import { NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { isDemo } from "@/lib/demo";
import { isSameOrigin, redirectTo } from "@/server/demo/http";
import { getOtherSandboxEmail, signInDemoUser } from "@/server/demo/sandbox";

// Changement de rôle : connecte le visiteur sur l'autre compte de son bac à sable
export async function POST(req: Request) {
  if (!isDemo) return new NextResponse(null, { status: 404 });
  if (!isSameOrigin(req)) return new NextResponse(null, { status: 403 });

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return redirectTo(req, "/login");

  const otherEmail = await getOtherSandboxEmail(session.user.id);
  if (!otherEmail) return redirectTo(req, "/browse");

  const cookies = await signInDemoUser(otherEmail, req.headers);
  return redirectTo(req, "/browse", cookies);
}
