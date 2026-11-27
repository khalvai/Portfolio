import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";

/**
 * The writing content lives outside this repo, so the path is absolute by
 * default. Override it with WRITINGS_DIR when building somewhere else.
 */
const WRITINGS_DIR =
  process.env.WRITINGS_DIR ??
  "/home/khalvai/Programming/Portfolio/src/content/writing";

export type Writing = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image: string;
  content: string;
  href: string;
};

type Frontmatter = {
  title?: string;
  description?: string;
  draft?: boolean;
  tags?: string[];
  date?: string | Date;
  image?: string;
};

async function findMarkdownFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return findMarkdownFiles(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        return [fullPath];
      }

      return [];
    }),
  );

  return nested.flat();
}

function getSlug(filePath: string) {
  const relativePath = path.relative(WRITINGS_DIR, filePath);
  const parsed = path.parse(relativePath);

  // Supports both content/writing/my-post.md and
  // content/writing/my-post/README.md.
  if (parsed.name.toLowerCase() === "readme") {
    return path.basename(parsed.dir);
  }

  return parsed.name;
}

function normalizeDate(value: unknown) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }

    return value;
  }

  return "";
}

function stripLeadingH1(content: string) {
  // The post page renders the frontmatter title as the page heading, so drop
  // a duplicated leading H1 from the markdown body.
  return content.replace(/^\s*#\s+.+(?:\r?\n)+/, "");
}

export const getAllWritings = cache(async (): Promise<Writing[]> => {
  let files: string[];

  try {
    files = await findMarkdownFiles(WRITINGS_DIR);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const writings = await Promise.all(
    files.map(async (filePath) => {
      const raw = await fs.readFile(filePath, "utf8");

      // Some files start with blank lines before the frontmatter. gray-matter
      // only detects frontmatter at the very start of the string.
      const source = raw.replace(/^\uFEFF/, "").replace(/^\s+(?=---)/, "");
      const { data, content } = matter(source);
      const frontmatter = data as Frontmatter;

      if (!frontmatter.title || !frontmatter.date || frontmatter.draft) {
        return null;
      }

      const slug = getSlug(filePath);

      return {
        slug,
        title: frontmatter.title,
        description: frontmatter.description ?? "",
        date: normalizeDate(frontmatter.date),
        tags: frontmatter.tags ?? [],
        image: frontmatter.image ?? "",
        content: stripLeadingH1(content).trim(),
        href: `/writing/${slug}`,
      } satisfies Writing;
    }),
  );

  return writings
    .filter((post): post is Writing => post !== null)
    .sort((a, b) => {
      const byDate = b.date.localeCompare(a.date);
      return byDate !== 0 ? byDate : a.title.localeCompare(b.title);
    });
});

export async function getWritingBySlug(slug: string) {
  const writings = await getAllWritings();
  return writings.find((post) => post.slug === slug) ?? null;
}

export async function getWritingSlugs() {
  const writings = await getAllWritings();
  return writings.map((post) => post.slug);
}
