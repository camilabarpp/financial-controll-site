import { http } from '@/utils/httpClient';

export interface SavingsGoal {
  id: number;
  name: string;
  savingTargetValue?: number;
  current: number;
  lastSaved?: number;
  savingDueDate?: string;
}

export interface SavingsGoalTotals {
  totalSaved: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

export interface SavingGoalDetail {
    id: number;
    name: string;
    savingTargetValue?: number;
    current: number;
    lastSaved?: number;
    savingDueDate?: string;
    transactions: SavingGoalTransactions[];
}

export interface SavingGoalTransactions {
    id: number;
    type: 'INCOME' | 'EXPENSE';
    value: number;
    date: string;
    description: string;
}

export interface SavingGoalSemesterTransactions {
    savingId: number;
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

export async function getSavingsGoalById(id: number): Promise<SavingsGoal> {
  return http.get<SavingsGoal>(`/savings/${id}`);
}

export async function createSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'current'>): Promise<SavingsGoal> {
  return http.post<SavingsGoal>('/savings', goal);
}

export async function updateSavingsGoal(id: number, goal: Partial<SavingsGoal>): Promise<SavingsGoal> {
  return http.put<SavingsGoal>(`/savings/${id}`, goal);
}

export async function deleteSavingsGoal(id: number): Promise<void> {
  return http.delete(`/savings/${id}`);
}

export async function deleteSavingGoalTransaction(savingId: number, transactionId: number): Promise<void> {
  return http.delete(`/savings/${savingId}/transactions/${transactionId}`);
}

export async function getSavingGoalTransactions(savingId: number): Promise<SavingGoalDetail> {
  return http.get<SavingGoalDetail>(`/savings/${savingId}/detail`);
}

export async function getSavingGoalSemesterTransactions(savingId: number): Promise<SavingGoalSemesterTransactions[]> {
  return http.get<SavingGoalSemesterTransactions[]>(`/savings/${savingId}/semester-transactions`);
}