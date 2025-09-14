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

interface ComboboxProps {
  items: string[]
  value: string
  placeholder?: string
  onChange: (value: string) => void
  createItem?: (value: string) => string
  className?: string
}

export function Combobox({ 
  items, 
  value, 
  placeholder = "Selecione um item",
  onChange,
  createItem,
  className
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const handleSelect = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue)
    setOpen(false)
  }

  const handleCreateItem = () => {
    if (createItem && searchTerm) {
      const newItem = createItem(searchTerm)
      onChange(newItem)
      setOpen(false)
      setSearchTerm("")
    }
  }

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
            ? items.find((item) => item === value)
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
            {createItem ? (
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
                key={item}
                value={item}
                onSelect={handleSelect}
              >
                {item}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === item ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
