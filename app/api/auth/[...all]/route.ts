import { auth } from "@/server/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { isDemo, isDemoAuthRouteAllowed } from "@/lib/demo";

const handlers = toNextJsHandler(auth);

// En démo, l'API d'authentification est réduite au strict nécessaire (voir lib/demo.ts)
function guard(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    if (isDemo && !isDemoAuthRouteAllowed(req.method, new URL(req.url).pathname)) {
      return Response.json({ message: "Disabled in the demo" }, { status: 403 });
    }
    return handler(req);
  };
}

export const GET = guard(handlers.GET);
export const POST = guard(handlers.POST);
