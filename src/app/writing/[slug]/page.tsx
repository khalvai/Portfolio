import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Markdown } from "@/components/markdown";
import { CONFIG } from "@/config";
import { formatDate } from "@/lib/format-date";
import { getAllWritings, getWritingBySlug } from "@/lib/writings";

type WritingPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const writings = await getAllWritings();
  return writings.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WritingPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);

  if (!post) {
    return {};
  }

  const url = `${new URL(CONFIG.siteUrl).origin}${post.href}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      siteName: CONFIG.name,
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function WritingPostPage({
  params,
}: WritingPostPageProps) {
  const { slug } = await params;
  const post = await getWritingBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="animate-enter">
      <Link
        href="/writing"
        className="group/link mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground"
      >
        <span aria-hidden="true">&larr;</span>
        <span className="link-underline">back</span>
      </Link>

      <header className="mb-10">
        <h1 className="text-balance text-2xl font-medium leading-tight text-foreground">
          {post.title}
        </h1>

        {post.description ? (
          <p className="mt-3 text-pretty leading-prose text-muted-foreground">
            {post.description}
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </div>
      </header>

      {post.image && !post.content.includes(post.image) ? (
        // The cover is authored in frontmatter at its natural size.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image}
          alt=""
          loading="lazy"
          className="mb-10 h-auto w-full rounded-lg"
        />
      ) : null}

      <Markdown content={post.content} />
    </article>
  );
}
