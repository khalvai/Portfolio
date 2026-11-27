import { WritingList } from "@/components/writing-list";
import { getAllWritings } from "@/lib/writings";

type WritingProps = {
  limit?: number;
  heading?: string;
  allHref?: string | null;
  className?: string;
};

const Writing = async ({
  limit,
  heading,
  allHref = "/writing",
  className = "mt-32",
}: WritingProps) => {
  const writings = await getAllWritings();
  const posts = writings.map(({ title, href, date }) => ({
    title,
    href,
    date,
  }));

  return (
    <WritingList
      posts={posts}
      limit={limit}
      heading={heading}
      allHref={allHref}
      className={className}
    />
  );
};

export default Writing;
