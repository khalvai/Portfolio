import { WritingList } from "@/components/project-list";
import { CONFIG } from "@/config";

const Writing = () => (
  <section className="mt-32 flex animate-enter flex-col gap-3">
    {/* <h2 className="font-medium">writing</h2> */}
    <WritingList projects={CONFIG.projects} />
  </section>
);

export default Writing;
