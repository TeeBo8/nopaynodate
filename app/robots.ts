import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/payments/"],
      },
    ],
    sitemap: "https://nopaynodate.com/sitemap.xml",
  };
}
