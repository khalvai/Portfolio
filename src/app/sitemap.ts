import { CONFIG } from "@/config";
import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: new URL(CONFIG.siteUrl).origin }];
}
