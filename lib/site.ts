// URL publique de l'appli. Sur une preview Vercel, NEXT_PUBLIC_APP_URL n'est pas définie :
// on retombe sur les URL fournies par Vercel (alias de branche, puis URL du déploiement).
const previewUrls =
  process.env.VERCEL_ENV === "preview"
    ? [process.env.VERCEL_BRANCH_URL, process.env.VERCEL_URL]
        .filter((host): host is string => !!host)
        .map((host) => `https://${host}`)
    : [];

export const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? previewUrls[0] ?? "http://localhost:3000";

// Origines acceptées par Better Auth
export const trustedOrigins = [process.env.BETTER_AUTH_URL ?? siteUrl, ...previewUrls];
