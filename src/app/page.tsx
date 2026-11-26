import Header from "@/components/header";
import Writing from "@/components/projects";
import TextSpotlightEffect from "@/components/text-spotlight";
import { CONFIG } from "@/config";

export default function Home() {
  return (
    <>
      <Header />

      <p className="animate-enter text-pretty leading-prose text-muted-foreground">
        {CONFIG.description}
      </p>

      <TextSpotlightEffect />
      <Writing />
    </>
  );
}
