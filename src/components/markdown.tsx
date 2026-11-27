import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const components: Components = {
  h1: ({ children }) => (
    <h2 className="mt-10 text-lg font-medium text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 text-lg font-medium text-foreground first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 font-medium text-foreground">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="mt-6 font-medium text-foreground">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="mt-4 leading-prose text-foreground">{children}</p>
  ),
  a: ({ href, children }) => {
    const external = href?.startsWith("http");

    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="underline decoration-1 decoration-muted-foreground underline-offset-4 transition-colors hover:decoration-foreground"
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 marker:text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="pl-1 leading-prose text-foreground">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-muted-foreground pl-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-muted-foreground" />,
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded-lg border border-[hsl(var(--foreground)/0.15)] bg-secondary p-4 text-[0.85rem] leading-relaxed">
      {children}
    </pre>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");

    if (isBlock) {
      return <code className={`${className} font-mono`}>{children}</code>;
    }

    return (
      <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.85em]">
        {children}
      </code>
    );
  },
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-[hsl(var(--foreground)/0.15)] px-3 py-2 text-left font-medium">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-[hsl(var(--foreground)/0.1)] px-3 py-2 align-top">
      {children}
    </td>
  ),
  img: ({ src, alt }) => (
    // The markdown images are authored at their natural size, so a plain img
    // keeps them from needing width/height props on every post.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      loading="lazy"
      className="mt-6 h-auto max-w-full rounded-lg"
    />
  ),
};

export function Markdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
