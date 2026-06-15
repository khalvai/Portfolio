/*
  Content Collections — your type-safe flat-file data layer.

  Analogy: this file is a Zod DTO / repository schema, exactly like you
  would write in a NestJS application. The difference is that instead of
  validating incoming HTTP request bodies, Astro validates the frontmatter
  of every Markdown file in each collection at build time.

  If a file's frontmatter is missing a required field or has the wrong type,
  the build fails with a clear error — the same guarantee you get from
  strict TypeScript + Zod in backend code.

  The two collections map to the two nav sections:
    - projects  →  /work
    - posts     →  /writing
*/

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  /*
    glob loader: scans the directory for Markdown files and makes them
    available as typed entries. The `id` of each entry is the filename
    without the extension (e.g. "hexagonal-arch").
  */
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Array of tech stack names rendered as StackTag badges */
    stack: z.array(z.string()),
    /**
     * z.coerce.date() converts the YAML date string "2024-03-15"
     * into a real JS Date object — the same way you'd use a Zod
     * transformer in a backend DTO.
     */
    date: z.coerce.date(),
    /** Featured projects appear highlighted in the /work listing */
    featured: z.boolean().default(false),
    /** Optional links */
    repo: z.string().url().optional(),
    live: z.string().url().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    /** draft: true means the post is skipped during production builds */
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

/*
  `collections` is the single export Astro looks for.
  The keys here ("projects", "posts") must match the folder names under
  src/content/ — Astro uses this mapping to know which schema to apply.
*/
export const collections = { projects, posts };
