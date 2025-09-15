import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useDateValidation } from "@/hooks/use-date-validation";
import { useInputMask } from "@/hooks/use-input-mask";
import InputMask from "react-input-mask";
import { useState } from "react";
import { Input } from "./ui/input";

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: {
    description: string;
    value: number;
    type: "INCOME" | "EXPENSE";
    date: string;
  }) => void;
  initialData?: {
    description: string;
    value: number;
    type: "INCOME" | "EXPENSE";
    date: string;
  };
  mode?: 'create' | 'edit';
}

export function AddTransactionModal({ open, onClose, onSubmit, initialData, mode = 'create' }: AddTransactionModalProps) {
  const emptyFormData = {
    description: "",
    valueFormatted: "",
    value: 0,
    type: "INCOME" as const,
    date: ""
  };

  const [formData, setFormData] = useState(initialData ? {
    description: initialData.description,
    valueFormatted: new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(initialData.value),
    value: initialData.value,
    type: initialData.type,
    date: initialData.date.split('-').reverse().join('/')
  } : emptyFormData);

  const [dateError, setDateError] = useState("");
  const { toast } = useToast();
  const { validateDate } = useDateValidation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let submissionDate = formData.date;
    
    if (!formData.date.includes('/')) {
      submissionDate = formData.date;
    } else {
      const dateValidation = validateDate(formData.date, true, false);
      
      if (!dateValidation.isValid) {
        toast({
          title: "Data inválida",
          description: dateValidation.error,
          variant: "destructive"
        });
        return;
      }
      submissionDate = dateValidation.formattedDate || formData.date;
    }

    if (formData.value <= 0) {
      toast({
        title: "Valor inválido",
        description: "O valor deve ser maior que zero",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      description: formData.description,
      value: formData.value,
      type: formData.type,
      date: submissionDate,
    });
  };

  const handleClose = () => {
    if (mode === 'create') {
      setFormData(emptyFormData);
      setDateError("");
    }
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={handleClose}>
      <DrawerContent className="max-w-md mx-auto rounded-t-2xl">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-bold">
            {mode === 'create' ? 'Adicionar Transação' : 'Editar Transação'}
          </DrawerTitle>
          <DrawerDescription>
            Preencha os dados para {mode === 'create' ? 'adicionar uma nova' : 'atualizar a'} transação
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <Input 
              type="text" 
              className="w-full rounded-lg px-3 py-2 bg-background" 
              placeholder="Ex: Depósito mensal"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <div className="space-y-2">
              <InputMask
                mask="99/99/9999"
                maskChar={null}
                className={`w-full border rounded-lg px-3 py-2 bg-background ${dateError ? 'border-red-500' : ''}`}
                placeholder="DD/MM/AAAA"
                value={formData.date}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({ ...prev, date: value }));
                  setDateError("");
                  
                  if (value.length === 10 || (value.length > 0 && value.length < 10)) {
                    const validation = validateDate(value, true, false);
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

          <div>
            <label className="block text-sm font-medium mb-1">Valor</label>
            <Input
              type="text"
              className="w-full border rounded-lg px-3 py-2 bg-background"
              placeholder="R$ 0,00"
              value={formData.valueFormatted}
              onChange={(e) => {
                const { maskCurrencyInput } = useInputMask();
                const { maskedValue, numericValue } = maskCurrencyInput(e.target.value);
                setFormData(prev => ({
                  ...prev,
                  valueFormatted: maskedValue,
                  value: numericValue
                }));
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value: "INCOME" | "EXPENSE") => setFormData(prev => ({ ...prev, type: value }))}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="INCOME" id="INCOME" />
                <span className="text-sm">Entrada</span>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="EXPENSE" id="EXPENSE" />
                <span className="text-sm">Saída</span>
              </div>
            </RadioGroup>
          </div>

          <DrawerFooter>
            <Button 
              type="submit" 
              className="w-full"
              disabled={!formData.description || !formData.value || !formData.date || dateError !== ""}
            >
              {mode === 'create' ? 'Adicionar' : 'Salvar alterações'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="w-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400"
            >
              Cancelar
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}