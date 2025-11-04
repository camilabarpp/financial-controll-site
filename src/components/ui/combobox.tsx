import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/utils/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Ajuste: suporte a objetos com label/value/color e custom handlers
export interface ComboboxItem {
  label: string
  value: string
  color?: string
}

interface ComboboxProps {
  items: ComboboxItem[]
  value: string
  placeholder?: string
  onChange: (value: string, color?: string, isNew?: boolean) => void
  onInputChange?: (input: string) => void
  allowCustom?: boolean
  color?: string
  onColorChange?: (color: string) => void
  className?: string
}

export function Combobox({
  items,
  value,
  placeholder = "Selecione um item",
  onChange,
  onInputChange,
  allowCustom = false,
  color,
  onColorChange,
  className
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  // Atualiza o valor do input externo se fornecido
  React.useEffect(() => {
    if (onInputChange) onInputChange(searchTerm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  const handleSelect = (currentValue: string) => {
    const selected = items.find(item => item.value === currentValue)
    onChange(currentValue, selected?.color, false)
    setOpen(false)
    setSearchTerm("")
  }

  const handleCreateItem = () => {
    if (allowCustom && searchTerm.trim()) {
      onChange(searchTerm.trim(), color, true)
      setOpen(false)
      // Corrigir: manter o valor criado como selecionado
      setSearchTerm("")
    }
  }

  // Corrigir: ao criar um novo, garantir que o valor fique selecionado no botão
  React.useEffect(() => {
    // Se o valor não está nos itens e não está vazio, mostra o valor no botão
    // (o botão já faz isso, mas garantimos que searchTerm não interfira)
    if (allowCustom && value && !items.some(item => item.value === value)) {
      console.log("Valor criado:", value)
      setSearchTerm("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Corrigir: ao abrir o popover, se valor não está nos itens, preenche o searchTerm com o valor
  React.useEffect(() => {
    if (open && allowCustom && value && !items.some(item => item.value === value)) {
      setSearchTerm(value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? items.find((item) => item.value === value)?.label || value
            : placeholder}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Pesquisar item..."
            className="h-9"
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandEmpty>
            {allowCustom ? (
              <Button
                variant="ghost"
                className="w-full justify-start px-2 py-1.5"
                onClick={handleCreateItem}
              >
                Criar "{searchTerm}"
              </Button>
            ) : (
              "Nenhum item encontrado."
            )}
          </CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={() => handleSelect(item.value)}
              >
                {/* Mostra cor se existir */}
                {item.color && (
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2 align-middle"
                    style={{ backgroundColor: item.color }}
                  />
                )}
                {item.label}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === item.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
          {allowCustom && onColorChange && (
            <div className="flex items-center gap-2 px-3 py-2 border-t mt-2">
              <span className="text-xs">Cor:</span>
              <input
                type="color"
                value={color}
                onChange={e => onColorChange(e.target.value)}
                className="w-6 h-6 border rounded"
                title="Cor da categoria"
              />
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
