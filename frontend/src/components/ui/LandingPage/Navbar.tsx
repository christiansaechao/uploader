import { NavLink } from "react-router-dom";
import { getNavLinkClass } from "@/utils/nav/getNavLinkClass";

export const Navbar = () => {
  return (
    <nav className="flex flex-row justify-start items-center p-4 bg-gray-800 text-white gap-10">
      <NavLink
        to="/"
        className={getNavLinkClass}
      >
        Home
      </NavLink>
      <NavLink
        to="/contact"
        className={getNavLinkClass}
      >
        Contact
      </NavLink>
      <NavLink
        to="/faq"
        className={getNavLinkClass}
      >
        FAQ
      </NavLink>
    </nav>
  );
};
