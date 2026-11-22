import { CONFIG } from "@/config";
import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${new URL(CONFIG.siteUrl).origin}/sitemap.xml`,
  };
}
