// Mode démo : couche par-dessus le vrai produit, activée par une variable d'environnement.
// DEMO_MODE est lue côté serveur, NEXT_PUBLIC_DEMO_MODE côté client (les deux doivent être définies).
export const isDemo =
  process.env.DEMO_MODE === "true" || process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// Un bac à sable = la paire de comptes éphémères d'un visiteur
export const DEMO_SANDBOX_TTL_HOURS = 24;
export const DEMO_MAX_ACTIVE_SANDBOXES = 200;
export const DEMO_MAX_SANDBOXES_PER_IP_PER_HOUR = 5;
export const DEMO_MAX_MESSAGES_PER_CHAT = 50;

// Domaine réservé (RFC 2606) : aucune adresse de démo ne peut recevoir d'email
export const DEMO_EMAIL_DOMAIN = "demo.invalid";

export const DEMO_TEST_CARD = "4242 4242 4242 4242";
