import { NavLink } from "react-router-dom";
import { IoWalletOutline } from "react-icons/io5";
import { cn } from "@/utils/utils";
import { ProfileDropdown } from "./ProfileDropdown";
import { ProfileSheet } from "./ProfileSheet";

const Header = () => {
  const navItems = [
    { to: "/", label: "Dashboard" },
    { to: "/insights", label: "Insights" },
    { to: "/savings", label: "Savings" },
    { to: "/transactions", label: "Transactions" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-2">
          <IoWalletOutline className="h-6 w-6" />
          <span className="font-bold">
            Financial Control
          </span>
        </div>
        
        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-6 ml-6">
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
        
        <div className="ml-auto flex items-center space-x-4">
          <ProfileDropdown />
          <ProfileSheet />
        </div>
      </div>
    </header>
  );
};

export default Header;