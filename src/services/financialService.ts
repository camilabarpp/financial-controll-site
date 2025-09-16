import { http } from '@/utils/httpClient';

export interface Balance {
  total: number;
  income: number;
  expenses: number;
  available: number;
  saved: number;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  categoryColor: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}

export async function getBalance(): Promise<Balance> {
  return http.get<Balance>('/balance');
}

export async function getRecentTransactions(): Promise<Transaction[]> {
  return http.get<Transaction[]>('/transactions/recent');
}