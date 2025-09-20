import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useDateValidation } from "@/hooks/use-date-validation";
import { useInputMask } from "@/hooks/use-input-mask";
import InputMask from "react-input-mask";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Combobox } from "./ui/combobox";

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: {
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    date: string;
    category: string;
  }) => void;
  initialData?: {
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    date: string;
    category: string;
  };
  mode?: 'create' | 'edit';
  categories?: string[];
}

export function TransactionModal({ 
  open, 
  onClose, 
  onSubmit, 
  initialData, 
  mode = 'create',
  categories = [] 
}: TransactionModalProps) {
  const emptyFormData = {
    description: "",
    valueFormatted: "",
    value: 0,
    type: "INCOME" as const,
    date: "",
    category: ""
  };

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        description: initialData.description,
        valueFormatted: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(initialData.amount),
        value: initialData.amount,
        type: initialData.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
        date: initialData.date.split('-').reverse().join('/'),
        category: initialData.category
      };
    }
    return emptyFormData;
  });

  const [dateError, setDateError] = useState("");
  const [newCategory, setNewCategory] = useState("");
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

    const finalCategory = formData.category || newCategory;
    if (!finalCategory) {
      toast({
        title: "Categoria obrigatória",
        description: "Por favor, selecione ou digite uma categoria",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      description: formData.description,
      amount: formData.value,
      type: formData.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
      date: submissionDate,
      category: finalCategory
    });
  };

  const handleClose = () => {
    if (mode === 'create') {
      setFormData(emptyFormData);
      setDateError("");
      setNewCategory("");
    }

    if (mode === 'edit' && initialData) {
      setFormData({
        description: initialData.description,
        valueFormatted: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(initialData.amount),
        value: initialData.amount,
        type: initialData.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
        date: initialData.date.split('-').reverse().join('/'),
        category: initialData.category
      });
    }

    onClose();
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description,
        valueFormatted: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(initialData.amount),
        value: initialData.amount,
        type: initialData.type,
        date: initialData.date.split('-').reverse().join('/'),
        category: initialData.category
      });
    } else {
      setFormData(emptyFormData);
    }
  }, [initialData]);

  const allCategories = [...new Set([...categories, newCategory].filter(Boolean))];

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
              className="w-full border rounded-lg px-3 py-2 bg-background" 
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
            <label className="block text-sm font-medium mb-1">Categoria</label>
            <Combobox
              items={allCategories}
              value={formData.category}
              placeholder="Selecione ou digite uma categoria"
              onChange={(value) => {
                setFormData(prev => ({ ...prev, category: value }));
                if (!categories.includes(value)) {
                  setNewCategory(value);
                }
              }}
              createItem={(value) => {
                setNewCategory(value);
                return value;
              }}
              className="w-full"
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
              disabled={!formData.description || !formData.value || !formData.date || dateError !== "" || (!formData.category && !newCategory)}
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
