import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { CONFIG } from "@/config";
import { getAllWritings, getWritingBySlug } from "@/lib/writings";

export const dynamic = "force-static";
export const alt = "Writing by Khalvai Ozbek";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "hsl(40, 15.8%, 96.3%)";
const INK = "hsl(42, 57.3%, 14.7%)";
const MUTED = "hsl(42, 16.6%, 37.5%)";

const font = (file: string) =>
  readFile(join(process.cwd(), "src/assets/fonts", file));

export async function generateStaticParams() {
  const writings = await getAllWritings();
  return writings.map(({ slug }) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);

  const [regular, medium] = await Promise.all([
    font("inter-latin-400-normal.woff"),
    font("inter-latin-500-normal.woff"),
  ]);

  const title = post?.title ?? "Writing";
  const description = post?.description ?? "";
  const titleSize = title.length > 70 ? 48 : title.length > 45 ? 56 : 64;
  const shortDescription =
    description.length > 150
      ? `${description.slice(0, 147).trimEnd()}...`
      : description;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "84px 104px",
          background: PAPER,
          color: INK,
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: MUTED,
          }}
        >
          Writing
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 36,
            maxWidth: 980,
            fontSize: titleSize,
            fontWeight: 500,
            lineHeight: 1.15,
            color: INK,
          }}
        >
          {title}
        </div>

        {shortDescription ? (
          <div
            style={{
              display: "flex",
              marginTop: 28,
              maxWidth: 900,
              fontSize: 30,
              lineHeight: 1.5,
              color: MUTED,
            }}
          >
            {shortDescription}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 26,
            color: MUTED,
          }}
        >
          {CONFIG.name}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: medium, weight: 500, style: "normal" },
      ],
    },
  );
}
