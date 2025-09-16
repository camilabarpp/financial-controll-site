import { NavLink } from "react-router-dom";
import { IoWalletOutline } from "react-icons/io5";
import { cn } from "@/utils/utils";
import { ProfileDropdown } from "./ProfileDropdown";
import { ProfileSheet } from "./ProfileSheet";

const Header = () => {
  const navItems = [
    { to: "/", label: "Dashboard" },
    { to: "/insights", label: "Gastos" },
    { to: "/savings", label: "Economias" },
    { to: "/transactions", label: "Transações" },
  ];
  const projectName = import.meta.env.VITE_SITE_NAME;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6" style={{ maxWidth: 830 }}>
        <div className="flex items-center space-x-2">
          <IoWalletOutline className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary text-sm md:text-base">
            {projectName || "Controle Financeiro"}
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4">
          <ProfileDropdown />
          <ProfileSheet />
        </div>
      </div>
    </header>
  );
};

export default Header;