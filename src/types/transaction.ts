export interface Transaction {
  id: number;
  type: "INCOME" | "EXPENSE";
  value: number;
  date: string;
  description: string;
}
