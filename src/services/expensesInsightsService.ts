import { http } from '@/utils/httpClient';

export interface ExpenseCategory {
  category: string;
  expenses: number;
  color: string;
}

export interface GroupedExpenses {
  month: string;
  expenses: number;
}

export interface ExpensesInsightsData {
  groupedExpenses: GroupedExpenses[];
  expenseCategory: ExpenseCategory[];
  totalExpenses: number;
  categoriesCount: number;
}

export async function getExpensesInsights(period: string): Promise<ExpensesInsightsData> {
  return http.get<ExpensesInsightsData>(`/expenses?period=${period}`);
}
