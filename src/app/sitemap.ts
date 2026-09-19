import type { MetadataRoute } from "next";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://yanglaoai999.com").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const publicRoutes = [
    "",
    "/pricing",
    "/products",
    "/policies",
    "/policy-match",
    "/institutions",
    "/care-crm",
    "/agents",
    "/solutions",
    "/resources",
    "/developers",
    "/docs",
    "/contact",
    "/compliance",
    "/trust",
    "/privacy",
    "/terms",
  ];

  return publicRoutes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.6,
  }));
}
