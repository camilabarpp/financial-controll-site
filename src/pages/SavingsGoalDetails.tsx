import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowDownRight, ArrowUpRight, Target, Calendar, TrendingUp, Plus, Pencil, Trash2, MoreVertical, PiggyBank } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { DeleteTransactionModal } from "@/components/DeleteTransactionModal";
import { DeleteSavingsModal } from "@/components/DeleteSavingsModal";
import { SavingsGoalModal } from "@/components/SavingsGoalModal";
import { useState, useMemo } from "react";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { calculateExpectedCompletion } from "@/utils/calculate-expected-saving_goal_completion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Transaction {
  id: number;
  type: "INCOME" | "EXPENSE";
  value: number;
  date: string;
  description: string;
}

interface SavingsGoal {
  id: number;
  name: string;
  savingsTargetValue?: number;
  current: number;
  lastSaved: number;
  savingsDueDate?: string;
  transactions: Transaction[];
}

//todo: Mocks
const savingsExtracts: Record<number, SavingsGoal> = {
  1: {
    id: 1,
    name: "Viagem Europa",
    savingsTargetValue: 15000,
    current: 8750,
    lastSaved: 1250,
    savingsDueDate: "2025-09-20T00:00:00.000Z",
    transactions: [
      { id: 1, type: "INCOME", value: 1500, date: "2025-04-15T00:00:00.000Z", description: "Aporte mensal" },
      { id: 2, type: "INCOME", value: 1800, date: "2025-05-10T00:00:00.000Z", description: "Aporte mensal" },
      { id: 3, type: "EXPENSE", value: 500, date: "2025-05-15T00:00:00.000Z", description: "Retirada emergencial" },
      { id: 4, type: "INCOME", value: 2000, date: "2025-06-10T00:00:00.000Z", description: "Aporte mensal" },
      { id: 5, type: "INCOME", value: 2200, date: "2025-07-10T00:00:00.000Z", description: "Aporte mensal" },
      { id: 6, type: "EXPENSE", value: 300, date: "2025-07-20T00:00:00.000Z", description: "Retirada" },
      { id: 7, type: "INCOME", value: 2500, date: "2025-08-10T00:00:00.000Z", description: "Aporte mensal" },
      { id: 8, type: "INCOME", value: 2000, date: "2025-09-10T00:00:00.000Z", description: "Aporte mensal" }
    ]
  },
  2: {
    id: 2,
    name: "Emergência",
    current: 12400,
    lastSaved: 2000,
    transactions: [
      { id: 1, type: "INCOME", value: 2000, date: "2025-04-05T00:00:00.000Z", description: "Aporte mensal" },
      { id: 2, type: "INCOME", value: 2000, date: "2025-05-05T00:00:00.000Z", description: "Aporte mensal" },
      { id: 3, type: "EXPENSE", value: 1500, date: "2025-05-15T00:00:00.000Z", description: "Emergência médica" },
      { id: 4, type: "INCOME", value: 2000, date: "2025-06-05T00:00:00.000Z", description: "Aporte mensal" },
      { id: 5, type: "INCOME", value: 2000, date: "2025-07-05T00:00:00.000Z", description: "Aporte mensal" },
      { id: 6, type: "INCOME", value: 2000, date: "2025-08-05T00:00:00.000Z", description: "Aporte mensal" },
      { id: 7, type: "EXPENSE", value: 800, date: "2025-08-20T00:00:00.000Z", description: "Manutenção carro" },
      { id: 8, type: "INCOME", value: 2000, date: "2025-09-05T00:00:00.000Z", description: "Aporte mensal" }
    ]
  },
  3: {
    id: 3,
    name: "Casa Nova",
    savingsTargetValue: 80000,
    current: 35000,
    lastSaved: 5000,
    savingsDueDate: "2026-12-31T00:00:00.000Z",
    transactions: [
      { id: 1, type: "INCOME", value: 5000, date: "2025-04-01T00:00:00.000Z", description: "Aporte mensal" },
      { id: 2, type: "INCOME", value: 5000, date: "2025-05-01T00:00:00.000Z", description: "Aporte mensal" },
      { id: 3, type: "INCOME", value: 6000, date: "2025-06-01T00:00:00.000Z", description: "Aporte mensal + bônus" },
      { id: 4, type: "INCOME", value: 5000, date: "2025-07-01T00:00:00.000Z", description: "Aporte mensal" },
      { id: 5, type: "EXPENSE", value: 2000, date: "2025-07-15T00:00:00.000Z", description: "Retirada planejada" },
      { id: 6, type: "INCOME", value: 5000, date: "2025-08-01T00:00:00.000Z", description: "Aporte mensal" },
      { id: 7, type: "INCOME", value: 5000, date: "2025-09-01T00:00:00.000Z", description: "Aporte mensal" }
    ]
  },
  4: {
    id: 4,
    name: "Carro Novo",
    savingsTargetValue: 45000,
    current: 15750,
    lastSaved: 3000,
    savingsDueDate: "2025-12-31T00:00:00.000Z",
    transactions: [
      { id: 1, type: "INCOME", value: 3000, date: "2025-04-10T00:00:00.000Z", description: "Aporte mensal" },
      { id: 2, type: "INCOME", value: 3000, date: "2025-05-10T00:00:00.000Z", description: "Aporte mensal" },
      { id: 3, type: "EXPENSE", value: 1000, date: "2025-05-20T00:00:00.000Z", description: "Retirada" },
      { id: 4, type: "INCOME", value: 3000, date: "2025-06-10T00:00:00.000Z", description: "Aporte mensal" },
      { id: 5, type: "INCOME", value: 3500, date: "2025-07-10T00:00:00.000Z", description: "Aporte mensal + extra" },
      { id: 6, type: "INCOME", value: 3000, date: "2025-08-10T00:00:00.000Z", description: "Aporte mensal" },
      { id: 7, type: "INCOME", value: 3000, date: "2025-09-10T00:00:00.000Z", description: "Aporte mensal" }
    ]
  }
};

const SavingsGoalDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const goal = savingsExtracts[Number(id) as keyof typeof savingsExtracts];
  const transactions = goal?.transactions || [];
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isEditingTransaction, setIsEditingTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleDeleteGoal = () => {
    console.log("Deletando meta:", goal?.id);
    navigate(-1);
  };

  const handleUpdateGoal = (updatedGoalData: {
    name: string;
    savingsTargetValue?: number;
    savingsDueDate?: string;
  }) => {
    console.log("Atualizando meta:", { id: goal?.id, ...updatedGoalData });
    setIsEditingGoal(false);
  };

  const handleEditGoal = () => {
    setIsEditingGoal(true);
  };

  const handleAddTransaction = (transaction: {
    description: string;
    value: number;
    type: "INCOME" | "EXPENSE";
    date: string;
  }) => {
    console.log("Nova transação:", transaction);
    setIsAddingTransaction(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditingTransaction(true);
  };

  const handleUpdateTransaction = (updatedTransaction: {
    description: string;
    value: number;
    type: "INCOME" | "EXPENSE";
    date: string;
  }) => {
    console.log("Atualizando transação:", { id: selectedTransaction?.id, ...updatedTransaction });
    setIsEditingTransaction(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = (transactionId: number) => {
    console.log("Deletando transação:", transactionId);
    setTransactionToDelete(null);
    //todo: Aqui você implementará a lógica de deleção quando tiver a API
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const progressPercentage = goal?.savingsTargetValue 
    ? calculateProgress(goal.current, goal.savingsTargetValue)
    : null;

  // Processamento dos dados para o gráfico
  const transactionsChartData = useMemo(() => {
    if (!transactions.length) return [];

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        year: date.getFullYear(),
        monthIndex: date.getMonth()
      };
    }).reverse();

    return last6Months.map(({ month, year, monthIndex }) => {
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === monthIndex && tDate.getFullYear() === year;
      });

      const income = monthTransactions
        .filter(t => t.type === "INCOME")
        .reduce((sum, t) => sum + t.value, 0);

      const expense = monthTransactions
        .filter(t => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.value, 0);

      return {
        name: month,
        entradas: income,
        saidas: expense
      };
    });
  }, [transactions]);

  const expectedCompletionDate = (goal?.savingsTargetValue && goal?.lastSaved)
    ? calculateExpectedCompletion(goal.current, goal.savingsTargetValue, goal.lastSaved)
    : null;

      let statusLabel = "";
      if (goal?.savingsTargetValue && goal?.savingsDueDate && expectedCompletionDate) {
        const dueDate = new Date(goal.savingsDueDate);
        if (expectedCompletionDate > dueDate) {
          statusLabel = "Atrasada";
        } else if (expectedCompletionDate < dueDate) {
          statusLabel = "Adiantada";
        } else {
          statusLabel = "No prazo";
        }
      }
      
  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-muted hover:bg-muted/70">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold">{goal?.name ? `${goal.name}` : "Extrato da Meta"}</h2>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleEditGoal} className="text-primary">
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar Meta
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsConfirmingDelete(true)} className="text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-900">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Meta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Card de informações da meta */}
          {(goal.savingsTargetValue || goal.savingsDueDate) && (
            <Card className="border-none shadow-md overflow-hidden">
              <CardContent className="p-0">
                {/* Hero Section com Progresso */}
                {goal.savingsTargetValue && (
                  <div className="bg-gradient-to-b from-primary/5 to-transparent px-4 pt-6 pb-2">
                    <div className="flex flex-col items-center mb-4">
                      <span className="text-3xl font-bold text-foreground mb-1">
                        {formatCurrency(goal.current)}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>de</span>
                        <span>{formatCurrency(goal.savingsTargetValue)}</span>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <Progress
                        value={progressPercentage || 0}
                        className="h-2"
                        style={{
                          backgroundColor: "hsl(var(--primary-transparent))"
                        }}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-xs font-medium">{progressPercentage?.toFixed(0)}% concluído</span>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          Faltam {formatCurrency(goal.savingsTargetValue - goal.current)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Datas */}
                <div className="px-4 py-4 grid grid-cols-2 gap-4">
                  {goal.savingsDueDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Data Final</span>
                        <span className="text-sm font-semibold">{formatDate(goal.savingsDueDate)}</span>
                      </div>
                    </div>
                  )}
                  {expectedCompletionDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className={`h-4 w-4 ${goal.savingsDueDate && expectedCompletionDate > new Date(goal.savingsDueDate) ? 'text-red-500' : 'text-primary'}`} />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Previsão</span>
                        <span className={`text-sm font-semibold ${goal.savingsDueDate && expectedCompletionDate > new Date(goal.savingsDueDate) ? 'text-red-500' : ''}`}>
                          {formatDate(expectedCompletionDate)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gráfico de Evolução */}
          {transactionsChartData.length > 0 && (
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Evolução nos Últimos 6 Meses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={transactionsChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="hsl(var(--muted-foreground)/0.2)" 
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        })}`}
                        dx={-10}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value: number) => formatCurrency(value)}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="entradas"
                        name="Entradas"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{
                          fill: 'hsl(var(--primary))',
                          strokeWidth: 2,
                          r: 4,
                          strokeDasharray: ''
                        }}
                        activeDot={{
                          fill: 'hsl(var(--primary))',
                          strokeWidth: 2,
                          r: 6,
                          stroke: 'hsl(var(--background))'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="saidas"
                        name="Saídas"
                        stroke="rgb(239, 68, 68)"
                        strokeWidth={2}
                        dot={{
                          fill: 'rgb(239, 68, 68)',
                          strokeWidth: 2,
                          r: 4,
                          strokeDasharray: ''
                        }}
                        activeDot={{
                          fill: 'rgb(239, 68, 68)',
                          strokeWidth: 2,
                          r: 6,
                          stroke: 'hsl(var(--background))'
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico de movimentações */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Histórico de Movimentações</CardTitle>
                <Button size="icon" className="rounded-full" onClick={() => setIsAddingTransaction(true)}>
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma movimentação registrada.</p>
              ) : (
                transactions.map((item) => (
                  <div 
                    key={item.id} 
                    className={`group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors relative
                      ${selectedTransaction?.id === item.id ? 'bg-primary/5' : ''}`}
                    onClick={() => setSelectedTransaction(selectedTransaction?.id === item.id ? null : item)}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {item.type === 'INCOME' ? (
                          <ArrowUpRight className="h-4 w-4 text-positive" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-negative" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-muted-foreground block mb-0.5">{formatDate(item.date)}</span>
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground truncate pr-4">{item.description}</p>
                          {selectedTransaction?.id !== item.id && (
                            <div className={`font-bold whitespace-nowrap ${item.type === 'INCOME' ? 'text-positive' : 'text-negative'}`}>
                              {formatCurrency(item.value)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {selectedTransaction?.id === item.id && (
                      <div className="flex items-center space-x-1 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTransaction(item);
                          }}
                          className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                        >
                          <Pencil className="h-4 w-4 text-primary" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTransactionToDelete(item);
                          }}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Modais permanecem iguais */}
        <AddTransactionModal
          open={isAddingTransaction}
          onClose={() => setIsAddingTransaction(false)}
          onSubmit={handleAddTransaction}
          mode="create"
        />

        {selectedTransaction && (
          <AddTransactionModal
            open={isEditingTransaction}
            onClose={() => {
              setIsEditingTransaction(false);
              setSelectedTransaction(null);
            }}
            onSubmit={handleUpdateTransaction}
            initialData={{
              description: selectedTransaction.description,
              value: selectedTransaction.value,
              type: selectedTransaction.type,
              date: selectedTransaction.date
            }}
            mode="edit"
          />
        )}

        <DeleteTransactionModal 
          open={!!transactionToDelete}
          onClose={() => setTransactionToDelete(null)}
          onConfirm={() => transactionToDelete && handleDeleteTransaction(transactionToDelete.id)}
        />

        <DeleteSavingsModal 
          open={isConfirmingDelete}
          onClose={() => setIsConfirmingDelete(false)}
          onConfirm={handleDeleteGoal}
          goalName={goal?.name || ''}
        />

        <SavingsGoalModal 
          open={isEditingGoal}
          onClose={() => setIsEditingGoal(false)}
          onSubmit={handleUpdateGoal}
          initialData={goal ? {
            name: goal.name,
            savingsTargetValue: goal.savingsTargetValue,
            savingsDueDate: goal.savingsDueDate
          } : undefined}
          mode="edit"
        />
      </div>
    </>
  );
};

export default SavingsGoalDetails;
