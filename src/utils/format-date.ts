export const formatDate = (date: string | Date) => {
  // Garante que a data está em UTC
  const utcDate = typeof date === 'string' ? new Date(date) : date;
  // Formata a data usando o Intl.DateTimeFormat para garantir consistência
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(utcDate);
};

export const createUTCDate = (year: number, month: number, day: number = 1) => {
  // Cria uma data em UTC
  return new Date(Date.UTC(year, month, day, 12, 0, 0, 0));
};

export const addMonthsToDate = (date: Date, months: number) => {
  // Pega os componentes UTC da data
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  
  // Cria nova data em UTC adicionando os meses
  return new Date(Date.UTC(year, month + months, day, 12, 0, 0, 0));
};

// Para usar em inputs de data (formato YYYY-MM-DD)
export const formatDateToISO = (date: Date) => {
  return date.toISOString().split('T')[0];
};
