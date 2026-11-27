import Link from "next/link";
import type { ReactNode } from "react";

// A link inside the muted bio sentence. At rest it is marked by ink alone,
// the same way a project's name stands out from its description; the
// hairline only appears on hover, focus, or press, as it does under the
// footer links. It is a real text underline held transparent rather than the
// footer's .link-underline, so it sits where the font puts it, close under
// the word instead of out in the space between two lines of prose.
const BioLink = ({ href, children }: { href: string; children: string }) => (
  <Link
    href={href}
    target="_blank"
    className="touch-target text-foreground underline decoration-transparent decoration-1 [text-underline-position:from-font] transition-[text-decoration-color] duration-150 hover:decoration-foreground focus-visible:decoration-foreground active:decoration-foreground"
  >
    {children}
  </Link>
);

export type Step = {
  title: string;
  href?: string;
};
export const steps: Step[] = [
  {
    title: "System Thinking",
    href: "https://www.youtube.com/watch?v=XL_lOoomRTA",
  },
  {
    title: "Domain Driven Design",
    href: "https://www.oreilly.com/library/view/learning-domain-driven-design/9781098100124/",
  },
  {
    title: "Microservices",
    href: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034018/",
  },
  {
    title: "Clean Architecture",
    href: "https://www.oreilly.com/library/view/get-your-hands/9781839211966/",
  },
  {
    title: "Fundamentals of Software Architecture",
    href: "https://www.oreilly.com/library/view/fundamentals-of-software/9781098175504/",
  },
  {
    title: "Design Patterns",
    href: "https://www.oreilly.com/library/view/head-first-design/9781492077992/",
  },
  {
    title: "Clean Code book",
    href: "https://www.oreilly.com/library/view/clean-code-a/9780136083238/",
  },
  { title: "Learned Nestjs", href: "https://github.com/khalvai/uploader" },
  { title: "Learned Ts", href: "https://github.com/khalvai/uploader" },
];

// The bio, written once as text and links. The page renders it with
// BioLinks; the meta description takes the plain text; llms.txt takes it as
// markdown, links kept; the share card draws it too. One source, so they all
// say the same thing.
export const BIO: (string | { text: string; href: string })[] = [
  "Every one has a story, and here is mein ",
];

type Config = {
  name: string;
  siteUrl: string;
  socials: {
    name: string;
    url: string;
    // email renders as a copy-to-clipboard mailto; links open a new tab
    kind: "link" | "email";
  }[];
  description: ReactNode;
  descriptionRaw: string;
  descriptionMarkdown: string;
  projects: {
    name: string;
    description: string;
    url?: string;
    github?: string;
  }[];
};

export const CONFIG: Config = {
  name: "Khalvai Ozbek",
  siteUrl: "https://khalvai.com/",
  socials: [
    {
      name: "github",
      url: "https://github.com/khalvai",
      kind: "link",
    },
    {
      name: "linkedin",
      url: "https://linkedin.com/in/khalvai-ozbek",
      kind: "link",
    },
    {
      name: "email",
      url: "mailto:hi@khalvayozbek@gmail.com",
      kind: "email",
    },
  ],
  description: (
    <>
      {BIO.map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          <BioLink key={i} href={part.href}>
            {part.text}
          </BioLink>
        ),
      )}
    </>
  ),
  descriptionRaw: BIO.map((part) =>
    typeof part === "string" ? part : part.text,
  ).join(""),
  descriptionMarkdown: BIO.map((part) =>
    typeof part === "string" ? part : `[${part.text}](${part.href})`,
  ).join(""),
  projects: [],
};
