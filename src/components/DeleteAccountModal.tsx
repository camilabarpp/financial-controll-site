import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useRef, useEffect } from "react";

interface DeleteAccountModalProps {
  open: boolean;
  isLoading: boolean;
  password: string;
  passwordError: string;
  showPassword: boolean;
  onPasswordChange: (value: string) => void;
  onShowPasswordToggle: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteAccountModal({
  open,
  isLoading,
  password,
  passwordError,
  showPassword,
  onPasswordChange,
  onShowPasswordToggle,
  onConfirm,
  onCancel
}: DeleteAccountModalProps) {
  const passwordInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (open && passwordInputRef.current) {
      setTimeout(() => {
        passwordInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  return (
    <Drawer open={open} onOpenChange={onCancel}>
      <DrawerContent className="max-w-md mx-auto rounded-t-2xl">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-bold">Excluir Conta</DrawerTitle>
          <DrawerDescription>
            Esta ação não pode ser desfeita.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <p className="text-muted-foreground mb-8">
            Tem certeza que deseja excluir sua conta? Todos os dados serão perdidos:
          </p>
          <ul className="list-disc list-inside text-sm space-y-1 pl-4 mb-8">
            <li>Histórico de transações</li>
            <li>Configurações personalizadas</li>
            <li>Dados de perfil</li>
            <li>Caixinhas de economia</li>
          </ul>
          <div className="mb-4">
            <Label htmlFor="deletePassword" className="text-sm font-medium">Digite sua senha para confirmar</Label>
            <div className="relative mt-2">
              <Input
                id="deletePassword"
                ref={passwordInputRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => onPasswordChange(e.target.value)}
                placeholder="Senha"
                className={`pr-10${passwordError ? ' border-red-500' : ''}`}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 w-10"
                onClick={onShowPasswordToggle}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {passwordError && (
              <p className="text-sm text-red-500 mt-1">{passwordError}</p>
            )}
          </div>
          <DrawerFooter className="px-0">
            <Button 
              type="button"
              variant="destructive"
              onClick={onConfirm}
              disabled={isLoading || !password.trim()}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Excluindo..." : "Sim, excluir permanentemente"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="w-full"
            >
              Cancelar
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
