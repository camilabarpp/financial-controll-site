import { Transaction } from "@/types/transaction";

interface PredictionResult {
  estimatedDate: Date | null;
  monthlyAverage: number;
  monthsRemaining: number | null;
}

export function calculateGoalPrediction(
  currentValue: number,
  targetValue: number,
  transactions: Transaction[]
): PredictionResult {
  // Filtra apenas transações de entrada (INCOME)
  const incomeTransactions = transactions.filter(t => t.type === "INCOME");
  
  if (incomeTransactions.length < 2) {
    return {
      estimatedDate: null,
      monthlyAverage: 0,
      monthsRemaining: null
    };
  }

  // Ordena transações por data
  const sortedTransactions = [...incomeTransactions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calcula o período total em meses entre a primeira e última transação
  const firstDate = new Date(sortedTransactions[0].date);
  const lastDate = new Date(sortedTransactions[sortedTransactions.length - 1].date);
  const monthsDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44); // média de dias por mês

  // Calcula a média mensal de aportes
  const totalValue = sortedTransactions.reduce((sum, t) => sum + t.value, 0);
  const monthlyAverage = monthsDiff > 0 ? totalValue / monthsDiff : totalValue;

  // Calcula quanto falta para atingir a meta
  const remaining = targetValue - currentValue;
  
  // Calcula quantos meses faltam com base na média mensal
  const monthsRemaining = monthlyAverage > 0 ? Math.ceil(remaining / monthlyAverage) : null;

  // Calcula a data estimada
  const estimatedDate = monthsRemaining 
    ? new Date(Date.now() + (monthsRemaining * 30.44 * 24 * 60 * 60 * 1000)) // converte meses para milissegundos
    : null;

  return {
    estimatedDate,
    monthlyAverage,
    monthsRemaining
  };
}
