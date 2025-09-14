interface DateValidationResult {
  isValid: boolean;
  error?: string;
  formattedDate?: string;
}

export const useDateValidation = () => {
  const validateDate = (dateString: string, isOptional: boolean = false, requireFutureDate: boolean = false): DateValidationResult => {
    if (isOptional && (!dateString || dateString.trim() === '')) {
      return {
        isValid: true,
        formattedDate: ''
      };
    }

    if (dateString && dateString.length !== 10) {
      return {
        isValid: false,
        error: "Por favor, digite a data completa"
      };
    }

    const [day, month, year] = dateString.split('/');
    
    if (!/^\d{2}$/.test(day) || !/^\d{2}$/.test(month) || !/^\d{4}$/.test(year)) {
      return {
        isValid: false,
        error: "Formato de data inválido"
      };
    }

    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);
    if (monthNum < 1 || monthNum > 12) {
      return {
        isValid: false,
        error: "Mês deve estar entre 1 e 12"
      };
    }

    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum < 1 || dayNum > daysInMonth) {
      return {
        isValid: false,
        error: `Dia deve estar entre 1 e ${daysInMonth} para o mês ${monthNum}`
      };
    }

    if (requireFutureDate) {
    const today = new Date();
    const maxYear = today.getFullYear() + 50;
    if (yearNum < today.getFullYear() || yearNum > maxYear) {
      return {
        isValid: false,
        error: `Ano deve estar entre ${today.getFullYear()} e ${maxYear}`
      };
    }

    const selectedDate = new Date(yearNum, monthNum - 1, dayNum);
    today.setHours(0, 0, 0, 0);      if (selectedDate < today) {
        return {
          isValid: false,
          error: "A data final deve ser maior que a data atual"
        };
      }
    }

    const formattedDay = dayNum.toString().padStart(2, '0');
    const formattedMonth = monthNum.toString().padStart(2, '0');
    const formattedDate = `${yearNum}-${formattedMonth}-${formattedDay}`;
    return {
      isValid: true,
      formattedDate
    };
  };

  const formatDateToISO = (dateString: string): string | null => {
    if (!dateString || dateString.length !== 10) return null;
    
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  return {
    validateDate,
    formatDateToISO
  };
};
