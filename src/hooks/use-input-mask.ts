interface CurrencyOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

interface DateMaskOptions {
  format?: string;
  separator?: string;
}

export const useInputMask = () => {
  const formatCurrency = (value: number | string, options: CurrencyOptions = {}) => {
    const {
      locale = 'pt-BR',
      currency = 'BRL',
      minimumFractionDigits = 2,
      maximumFractionDigits = 2
    } = options;

    // Se for string, converte para número
    const numericValue = typeof value === 'string' 
      ? Number(value.replace(/\D/g, '')) / 100
      : value;

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(numericValue);
  };

  const parseCurrencyToNumber = (value: string): number => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    // Converte para número e divide por 100 para obter o valor em reais
    return numbers ? Number(numbers) / 100 : 0;
  };

  const maskCurrencyInput = (value: string): { 
    maskedValue: string;
    numericValue: number;
  } => {
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    
    // Se não houver números, retorna vazio
    if (!numbers) {
      return {
        maskedValue: '',
        numericValue: 0
      };
    }
    
    // Converte para número e formata
    const amount = (Number(numbers) / 100).toFixed(2);
    const [intPart, decPart] = amount.split('.');
    
    // Adiciona pontos para milhares apenas se necessário
    let formattedInt = intPart;
    if (intPart.length > 3) {
      formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    return {
      maskedValue: `R$ ${formattedInt},${decPart}`,
      numericValue: Number(amount)
    };
  };

  const maskDate = (value: string, options: DateMaskOptions = {}): string => {
    const { separator = '/' } = options;
    
    // Remove tudo exceto números
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0, 2)}${separator}${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}${separator}${numbers.slice(2, 4)}${separator}${numbers.slice(4, 8)}`;
  };

  const maskCPF = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const maskPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const maskCEP = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  return {
    formatCurrency,
    parseCurrencyToNumber,
    maskCurrencyInput,
    maskDate,
    maskCPF,
    maskPhone,
    maskCEP
  };
};
