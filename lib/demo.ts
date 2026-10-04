// Mode démo : couche par-dessus le vrai produit, activée par une variable d'environnement.
// DEMO_MODE est lue côté serveur, NEXT_PUBLIC_DEMO_MODE côté client (les deux doivent être définies).
export const isDemo =
  process.env.DEMO_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// Un bac à sable = la paire de comptes éphémères d'un visiteur
export const DEMO_SANDBOX_TTL_HOURS = 24;
export const DEMO_MAX_ACTIVE_SANDBOXES = 200;
export const DEMO_MAX_SANDBOXES_PER_IP_PER_HOUR = 3;
export const DEMO_MAX_SANDBOXES_PER_IP_PER_DAY = 8;
export const DEMO_MAX_REQUESTS_PER_ACCOUNT = 20;
export const DEMO_MAX_MESSAGES_PER_CHAT = 50;

// Domaine réservé (RFC 2606) : aucune adresse de démo ne peut recevoir d'email
export const DEMO_EMAIL_DOMAIN = "demo.invalid";

export const DEMO_TEST_CARD = "4242 4242 4242 4242";

// Comptes éphémères créés pour chaque visiteur
export const DEMO_PERSONAS = {
  man: {
    slug: "marc",
    name: "Marc",
    birthdate: "1993-06-14",
    city: "New York",
    bio: "Demo account. I send date requests and pay the deposit.",
  },
  woman: {
    slug: "lea",
    name: "Léa",
    birthdate: "1996-02-21",
    city: "New York",
    bio: "Demo account. I set my deposit and accept or decline requests.",
  },
} as const;

// En démo, seules ces routes Better Auth restent ouvertes au navigateur.
// Tout le reste (inscription, connexion par mot de passe, Google, changement d'email…) est refusé :
// les comptes sont créés et connectés uniquement par /api/demo/enter et /api/demo/switch.
const DEMO_ALLOWED_AUTH_ROUTES = ["GET /get-session", "POST /sign-out", "GET /ok"];

export function isDemoAuthRouteAllowed(method: string, pathname: string): boolean {
  const path = pathname.replace(/^\/api\/auth/, "").replace(/\/$/, "");
  return DEMO_ALLOWED_AUTH_ROUTES.includes(`${method.toUpperCase()} ${path}`);
}
