import { http } from '@/utils/httpClient';

export interface Balance {
  avaliable: number;
  income: number;
  expense: number;
  saved: number;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  category: string;
  categoryColor?: string;
  date: string;
  type: 'INCOME' | 'EXPENSE';
}

export interface TransactionTotals {
  transactionIncome: number
  transactionExpense: number;
  transactions: Transaction[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface TransactionCategory {
  category: string;
  categoryColor?: string;
}

export type SortOrder = '' | 'ASC' | 'DESC';

export async function getBalance(): Promise<Balance> {
  return http.get<Balance>('/transactions/balance');
}

export async function getRecentTransactions(): Promise<Transaction[]> {
  return http.get<Transaction[]>('/transactions/recent');
}

export async function getAllTransactions(
  period: string, 
  search?: string,
  sort?: SortOrder,
  transactionType?: 'INCOME' | 'EXPENSE' | 'ALL',
  currentPage?: number
): Promise<TransactionTotals> {
  const params = new URLSearchParams();
  if (period) params.append('period', period);
  if (search) params.append('search', search);
  params.append('sort', sort);
  if (transactionType) params.append('transactionType', transactionType);
  if (currentPage) params.append('currentPage', currentPage.toString());

  return http.get<TransactionTotals>(`/transactions?${params.toString()}`);
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

export async function getCategories(search?: string): Promise<TransactionCategory[]> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  return http.get<TransactionCategory[]>(`/transactions/categories?${params.toString()}`);
}