import Link from "next/link";
import { formatDate } from "@/lib/format-date";

export type WritingListItem = {
  title: string;
  href: string;
  /** ISO date, e.g. "2026-11-27" */
  date: string;
};

type WritingListProps = {
  posts: WritingListItem[];
  /** Omit to show every post. */
  limit?: number;
  heading?: string;
  /** Set to null on the full /writing page to hide the link. */
  allHref?: string | null;
  className?: string;
};

export function WritingList({
  posts,
  limit,
  heading = "Writing",
  allHref = "/writing",
  className = "",
}: WritingListProps) {
  const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  const visiblePosts =
    typeof limit === "number" ? sortedPosts.slice(0, limit) : sortedPosts;

  if (visiblePosts.length === 0) return null;

  return (
    <section className={`flex animate-enter flex-col gap-4 ${className}`}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-muted-foreground">
          {heading}:
        </h2>
      </div>

      <ul className="flex flex-col gap-3">
        {visiblePosts.map((post) => (
          <li key={post.href}>
            <Link href={post.href} className="group flex items-center gap-2">
              <span
                title={post.title}
                className="min-w-0 truncate text-[0.95rem] font-medium text-foreground"
              >
                {post.title}
              </span>

              <span
                aria-hidden="true"
                className="min-w-[1.25rem] flex-1 border-b border-dashed border-[hsl(var(--foreground)/0.15)] transition-colors group-hover:border-[hsl(var(--foreground)/0.3)]"
              />

              <time
                dateTime={post.date}
                className="shrink-0 font-mono text-[0.75rem] uppercase tabular-nums text-muted-foreground transition-colors group-hover:text-foreground"
              >
                {formatDate(post.date)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
