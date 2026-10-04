import { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { isDemo } from "@/lib/demo";

export default function robots(): MetadataRoute.Robots {
  // Démo : rien n'est proposé à l'indexation
  if (isDemo) return { rules: [{ userAgent: "*", disallow: "/" }] };

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/payments/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
