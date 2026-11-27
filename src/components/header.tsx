import { CONFIG } from "@/config";
import Link from "next/link";

// The name is set like a section label (body size, medium) and sits 16px over
// the bio, so it reads as the bio's heading rather than a banner.
const Header = () => {
  return (
    <header className="mb-4 animate-enter">
      <Link href={"/"} className="font-medium">
        {CONFIG.name}
      </Link>
    </header>
  );
};

export default Header;
