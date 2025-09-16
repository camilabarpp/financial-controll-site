import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export function ProfileDropdown() {
  const { navigateTo } = useAppNavigation();
  const { logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigateTo('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full hidden md:flex items-center gap-1 px-2 focus:bg-transparent active:bg-transparent hover:bg-muted/40">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar || undefined} alt={user?.name || "@user"} />
            <AvatarFallback>{user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : "U"}</AvatarFallback>
          </Avatar>
          <ChevronDown className="h-4 w-4 text-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.name || "Usuário"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => navigateTo('/account')}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 hover:!text-red-600 focus:!text-red-600 hover:!bg-red-100/50"
          onSelect={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}