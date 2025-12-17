import { http } from '@/utils/httpClient';

export interface SavingsGoal {
  id: string;
  name: string;
  savingTargetValue?: number;
  current: number;
  lastSaved?: number;
  savingDueDate?: string;
}

export interface UpdateSavingsGoal {
  name: string;
  savingTargetValue?: number;
  savingDueDate?: string;
}

export interface SavingsGoalTotals {
  totalSaved: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface SavingGoalDetail {
    id: string;
    name: string;
    savingTargetValue?: number;
    current: number;
    lastSaved?: number;
    savingDueDate?: string;
    transactions: SavingGoalTransactions[];
    transactionsTotal: number;
    transactionsTotalPages: number;
    transactionsCurrentPage: number;
}

export interface SavingGoalTransactions {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    value: number;
    date: string;
    description: string;
}

export interface SavingGoalTransactionRequest {
    type: 'INCOME' | 'EXPENSE';
    value: number;
    date: string;
    description: string;
}

export interface SavingGoalSemesterTransactions {
    month: string;
    incomeValue: number;
    expenseValue: number;
}

export async function getAllSavingsGoals(): Promise<SavingsGoal[]> {
  return http.get<SavingsGoal[]>('/savings');
}

export async function getSavingsGoalTotals(): Promise<SavingsGoalTotals> {
  return http.get<SavingsGoalTotals>('/savings/totals');
}

export async function getSavingsGoalById(id: string): Promise<SavingsGoal> {
  return http.get<SavingsGoal>(`/savings/${id}`);
}

export async function createSavingsGoal(goal: Omit<UpdateSavingsGoal, 'id' | 'current'>): Promise<SavingsGoal> {
  return http.post<SavingsGoal>('/savings', goal);
}

export async function updateSavingsGoal(id: string, goal: Partial<UpdateSavingsGoal>): Promise<SavingsGoal> {
  return http.put<SavingsGoal>(`/savings/${id}`, goal);
}

export async function deleteSavingsGoal(id: string): Promise<void> {
  return http.delete(`/savings/${id}`);
}

export async function getSavingGoalTransactions(savingId: string, transactionPage: number): Promise<SavingGoalDetail> {
  return http.get<SavingGoalDetail>(`/savings/${savingId}/detail?transactionPage=${transactionPage}`);
}

export async function getSavingGoalSemesterTransactions(savingId: string): Promise<SavingGoalSemesterTransactions[]> {
  return http.get<SavingGoalSemesterTransactions[]>(`/savings/${savingId}/semester-transactions`);
}

export async function addSavingGoalTransaction(savingId: string, transaction: {
  description: string;
  value: number;
  type: "INCOME" | "EXPENSE";
  date: string;
}): Promise<SavingGoalTransactions> {
  return http.post<SavingGoalTransactions>(`/savings/${savingId}/transactions`, transaction);
}

export async function updateSavingGoalTransaction(savingId: string, transactionId: string, transaction: SavingGoalTransactionRequest): Promise<SavingGoalTransactions> {
  return http.put<SavingGoalTransactions>(`/savings/${savingId}/transactions/${transactionId}`, transaction);
}

export async function deleteSavingGoalTransaction(savingId: string, transactionId: string): Promise<void> {
  return http.delete(`/savings/${savingId}/transactions/${transactionId}`);
}