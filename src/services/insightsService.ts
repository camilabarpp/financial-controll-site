import { http } from '@/utils/httpClient';

export interface ExpenseCategory {
  category: string;
  expenses: number;
  color: string;
}

export interface SemesterExpense {
  month: string;
  expenses: number;
}

export interface InsightsData {
  semesterExpense: SemesterExpense[];
  expenseCategory: ExpenseCategory[];
  totalExpenses: number;
  categoriesCount: number;
}

export async function getInsights(period: string): Promise<InsightsData> {
  return http.get<InsightsData>(`/insights?period=${period}`);
}
