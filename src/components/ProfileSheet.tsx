import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export function ProfileSheet() {
  const { navigateTo } = useAppNavigation();
  const [open, setOpen] = useState(false);
  const { logout, user } = useContext(AuthContext);

  const handleProfileClick = () => {
    setOpen(false);
    navigateTo('/account');
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigateTo('/login');
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full md:hidden flex items-center gap-1 px-2 focus:bg-transparent active:bg-transparent hover:bg-muted/40">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || undefined} alt={user?.name || "@user"} />
            <AvatarFallback>{user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : "U"}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[300px] bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <SheetHeader>
          <SheetTitle>Minha Conta</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4 rounded-lg p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user?.avatar || undefined} alt={user?.name || "@user"} />
              <AvatarFallback>{user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name || "Usuário"}</span>
              <span className="text-xs text-muted-foreground">{user?.email || ""}</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2"
              onClick={handleProfileClick}
            >
              <User size={16} />
              Perfil
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-100/50"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}