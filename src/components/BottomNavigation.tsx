import { Home, BarChart3, PiggyBank, Receipt } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { name: "Início", icon: Home, path: "/" },
    { name: "Gastos", icon: BarChart3, path: "/expenses" },
    { name: "Economias", icon: PiggyBank, path: "/savings" },
    { name: "Extrato", icon: Receipt, path: "/transactions" },
  ];

  return (
    <div className="md:hidden fixed bottom-4 left-0 right-0 px-4 z-50">
      <div className="max-w-[894px] mx-auto">
        <nav className="bg-background border border-border/40 rounded-full shadow-lg backdrop-blur-sm bg-background/95">
          <div className="flex justify-around items-center py-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex flex-col items-center justify-center p-2 rounded-full transition-all ${
                  isActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'text-primary' : ''}`}>
                  {item.name}
                </span>
              </NavLink>
            );
          })}
          </div>
        </nav>  
      </div>
    </div>
  );
};

export default BottomNavigation;