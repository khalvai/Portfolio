import { CONFIG } from "@/config";
import Link from "next/link";

type Project = (typeof CONFIG.projects)[number];

const rowLink =
  "focus-visible:outline-none after:absolute after:inset-0 after:rounded-lg after:content-[''] focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-ring";

const WritingRow = ({ project }: { project: Project }) => {
  // Where the row goes: the live site if there is one, else the repo.
  const href = project.url ?? project.github;

  return (
    <li className="py-1.5">
      <div className="relative -mx-2 rounded-lg p-2 transition-colors duration-150 hover:bg-secondary has-[[data-row-link]:active]:bg-accent">
        {href ? (
          <Link href={href} target="_blank" data-row-link className={rowLink}>
            {project.name}
            {!project.url && <span className="sr-only"> on github</span>}
          </Link>
        ) : (
          <span>{project.name}</span>
        )}
        <p className="text-pretty text-muted-foreground">
          {project.description}
        </p>
      </div>
    </li>
  );
};

// The negative margins take back the outer rows' padding, so the list starts
// one row gap below its label (20px, then 28px) and ends on its last line of
// text, leaving the section gap below it exact.
export const WritingList = ({ projects }: { projects: Project[] }) => (
  <ul className="flex flex-col">
    {projects.map((project) => (
      <WritingRow key={project.name} project={project} />
    ))}
  </ul>
);
