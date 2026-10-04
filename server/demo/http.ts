import { NextResponse } from "next/server";

// Refuse les POST venant d'un autre site (formulaire piégé)
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

// Redirection après un POST de formulaire (303), avec les cookies de session éventuels
export function redirectTo(req: Request, path: string, cookies: string[] = []): NextResponse {
  const response = NextResponse.redirect(new URL(path, req.url), 303);
  for (const cookie of cookies) response.headers.append("set-cookie", cookie);
  return response;
}
