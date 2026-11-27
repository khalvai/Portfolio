import { CONFIG } from "@/config";
import { getAllWritings } from "@/lib/writings";
import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = new URL(CONFIG.siteUrl).origin;
  const writings = await getAllWritings();

  return [
    { url: origin },
    { url: `${origin}/writing` },
    ...writings.map((post) => ({
      url: `${origin}${post.href}`,
      lastModified: post.date,
    })),
  ];
}
