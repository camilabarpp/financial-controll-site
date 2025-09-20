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

export interface TransactionTotals {
  income: number
  expenses: number;
  total: number;
}

export type SortOrder = '' | 'ASC' | 'DESC';

export async function getBalance(): Promise<Balance> {
  return http.get<Balance>('/balance');
}

export async function getRecentTransactions(): Promise<Transaction[]> {
  return http.get<Transaction[]>('/transactions/recent');
}

export async function getAllTransactions(
  period: string, 
  search?: string,
  sort?: SortOrder
): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (period) params.append('period', period);
  if (search) params.append('search', search);
  params.append('sort', sort);

  return http.get<Transaction[]>(`/transactions?${params.toString()}`);
}

export async function createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  return http.post<Transaction>('/transactions', transaction);
}

export async function updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
  return http.put<Transaction>(`/transactions/${id}`, transaction);
}

export async function deleteTransaction(id: number): Promise<void> {
  return http.delete(`/transactions/${id}`);
}

export async function getTransactionTotals(period: string): Promise<TransactionTotals> {
  return http.get<TransactionTotals>(`/transactions/totals?period=${period}`);
}