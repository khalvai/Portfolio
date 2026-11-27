import { CONFIG, steps } from "@/config";

// /llms.txt (llmstxt.org): the site in plain markdown, for agents and anyone
// who would rather read text than a page. Built from CONFIG, the same source
// the home page renders, so the two say the same thing word for word;
// prerendered once at build time like any static file.
export const dynamic = "force-static";

export function GET() {
  // Each project links where its row on the page does: the live site if
  // there is one, else the repo.
  const path = steps.map((s) => `- [${s.title}](${s.href})`);

  const links = CONFIG.socials.map((s) => `- [${s.name}](${s.url})`);

  const body = [
    `# ${CONFIG.name}`,
    "",
    `> ${CONFIG.descriptionMarkdown}`,
    "",
    "## Growth path",
    "",
    ...path,
    "",
    "## links",
    "",
    ...links,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
