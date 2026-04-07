import { CgMenuRightAlt } from "react-icons/cg";
import Logo from "../../shared/Logo";
import ResponsiveWidth from "../../shared/ResponsiveWidth";
import AccountSection from "./AccountSection";
import NavbarLinks from "@/components/shared/NavbarLinks";

function Navbar() {
  return (
    <nav
      className="bg-primary text-white border-b-2 border-secondary"
      aria-label="Homepage navigation"
    >
      <ResponsiveWidth>
        <div className="py-5 flex items-center justify-between">
          <>
            <Logo logoSize={48} />
          </>

          <>
            <NavbarLinks />
          </>

          <div className="hidden lg:flex">
            <AccountSection />
          </div>

          {/* hamburger menu for small devices */}
          <div className="flex lg:hidden">
            <CgMenuRightAlt size={32} />
          </div>
        </div>
      </ResponsiveWidth>
    </nav>
  );
}

export default Navbar;
