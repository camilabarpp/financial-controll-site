import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

interface DeleteSavingsModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  goalName: string;
}

export function DeleteSavingsModal({ open, onClose, onConfirm, goalName }: DeleteSavingsModalProps) {
  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-w-md mx-auto rounded-t-2xl">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-bold">Excluir Meta</DrawerTitle>
          <DrawerDescription>
            Esta ação não pode ser desfeita.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-4">
          <p className="text-muted-foreground mb-8">
            Tem certeza que deseja excluir a meta "{goalName}"? Todas as transações relacionadas também serão excluídas.
          </p>

          <DrawerFooter className="px-0">
            <Button 
              type="button"
              variant="destructive"
              onClick={onConfirm}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Excluir Meta
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
