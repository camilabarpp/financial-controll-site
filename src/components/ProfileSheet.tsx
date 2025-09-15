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
import { LogOut, User } from "lucide-react";
import { useAppNavigation } from "@/hooks/useAppNavigation";

export function ProfileSheet() {
  const { navigateTo } = useAppNavigation();
  const [open, setOpen] = useState(false);

  const handleProfileClick = () => {
    setOpen(false); // Fecha o modal
    navigateTo('/account'); // Navega para a página
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full md:hidden">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/camilabarpp.png" alt="@camilabarpp" />
            <AvatarFallback>CB</AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[300px]">
        <SheetHeader>
          <SheetTitle>Minha Conta</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4 rounded-lg p-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="https://github.com/camilabarpp.png" alt="@camilabarpp" />
              <AvatarFallback>CB</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Camila Barpp</span>
              <span className="text-xs text-muted-foreground">camila@email.com</span>
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
            <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-100/50">
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}