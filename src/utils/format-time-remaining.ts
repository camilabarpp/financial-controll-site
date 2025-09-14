export const formatTimeRemaining = (dueDate: string | Date | null) => {
  if (!dueDate) return "Indefinido";
  
  const now = new Date();
  const targetDate = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  targetDate.setUTCHours(12, 0, 0, 0);
  now.setUTCHours(12, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.ceil(diffDays / 30);

  if (diffDays <= 0) {
    return "Meta vencida";
  }
  
  if (diffDays < 30) {
    return `${diffDays} dias restantes`;
  }

  if (diffMonths <= 12) {
    const monthText = diffMonths === 1 ? "mês restante" : "meses restantes";
    return `${diffMonths} ${monthText}`;
  }

  return targetDate.toLocaleDateString('pt-BR');
};
