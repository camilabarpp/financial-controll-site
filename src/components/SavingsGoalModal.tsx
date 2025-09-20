import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useToast } from "@/components/ui/use-toast";
import { useDateValidation } from "@/hooks/use-date-validation";
import { useInputMask } from "@/hooks/use-input-mask";
import InputMask from "react-input-mask";
import { useState, useEffect } from "react";

interface SavingsGoalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (goalData: {
    name: string;
    savingTargetValue?: number;
    savingDueDate?: string;
  }) => void;
  initialData?: {
    name: string;
    savingTargetValue?: number;
    savingDueDate?: string;
  };
  mode?: 'create' | 'edit';
}

export function SavingsGoalModal({ 
  open, 
  onClose, 
  onSubmit, 
  initialData,
  mode = 'create' 
}: SavingsGoalModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    savingTargetValueFormatted: '',
    savingTargetValue: 0,
    savingDueDate: ''
  });
  const [dateError, setDateError] = useState("");
  const { toast } = useToast();
  const { validateDate } = useDateValidation();

  useEffect(() => {
    if (initialData) {
      const formattedDate = initialData.savingDueDate 
        ? initialData.savingDueDate.split('-').reverse().join('/') 
        : '';

      setFormData({
        name: initialData.name,
        savingTargetValueFormatted: initialData.savingTargetValue 
          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(initialData.savingTargetValue)
          : '',
        savingTargetValue: initialData.savingTargetValue || 0,
        savingDueDate: formattedDate
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dateValidation = validateDate(formData.savingDueDate, true, true);
    
    if (formData.savingDueDate && !dateValidation.isValid) {
      toast({
        title: "Data inválida",
        description: dateValidation.error,
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      name: formData.name,
      savingTargetValue: formData.savingTargetValue || undefined,
      savingDueDate: dateValidation.formattedDate
    });
  };

  const handleClose = () => {
    setFormData({
      name: '',
      savingTargetValueFormatted: '',
      savingTargetValue: 0,
      savingDueDate: ''
    });
    setDateError('');
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent className="max-w-md mx-auto rounded-t-2xl">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-bold">
            {mode === 'create' ? 'Adicionar meta' : 'Editar meta'}
          </DrawerTitle>
          <DrawerDescription>
            Preencha os dados para {mode === 'create' ? 'criar uma nova' : 'atualizar a'} meta de economia
          </DrawerDescription>
        </DrawerHeader>
        <form className="space-y-4 px-4 pb-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Nome da meta</label>
            <input 
              type="text" 
              className="w-full border rounded-lg px-3 py-2 bg-background" 
              placeholder="Ex: Viagem, Casa, Emergência"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Valor da meta</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 bg-background"
              placeholder="R$ 0,00"
              value={formData.savingTargetValueFormatted}
              onChange={(e) => {
                const { maskCurrencyInput } = useInputMask();
                const { maskedValue, numericValue } = maskCurrencyInput(e.target.value);
                
                setFormData(prev => ({
                  ...prev,
                  savingTargetValueFormatted: maskedValue,
                  savingTargetValue: numericValue
                }));
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data final</label>
            <div className="space-y-2">
              <InputMask
                mask="99/99/9999"
                maskChar={null}
                className={`w-full border rounded-lg px-3 py-2 bg-background ${dateError ? 'border-red-500' : ''}`}
                placeholder="DD/MM/AAAA"
                value={formData.savingDueDate}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, savingDueDate: value }));
                  setDateError(""); 
                  
                  if (value.length === 10 || (value.length > 0 && value.length < 10)) {
                    const validation = validateDate(value, true, true);
                    if (!validation.isValid) {
                      setDateError(validation.error || "Data inválida");
                    }
                  }
                }}
              />
              {dateError && (
                <p className="text-sm text-red-500">{dateError}</p>
              )}
            </div>
          </div>
          <DrawerFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={!formData.name.trim()}
            >
              {mode === 'create' ? 'Criar meta' : 'Salvar alterações'}
            </Button>
            <Button 
              type="button"
              variant="outline"
              className="w-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400" 
              onClick={handleClose}
            >
              Cancelar
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
