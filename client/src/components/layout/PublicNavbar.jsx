import { Link, NavLink } from "react-router-dom";
import { Cloud } from "lucide-react";
import { Button } from "../ui/Button";

const links = [
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Login", to: "/login" },
];

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-900/65 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-sky-400/90 p-2 text-zinc-900">
            <Cloud size={16} />
          </div>
          <span className="text-lg font-semibold">NebulaStorage</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm transition ${isActive ? "text-sky-300" : "text-zinc-300 hover:text-white"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/signup">
            <Button className="px-5">Start Free</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
