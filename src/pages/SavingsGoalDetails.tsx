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
import { useEffect, useState, useMemo } from "react";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { calculateExpectedCompletion } from "@/utils/calculate-expected-saving_goal_completion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { deleteSavingsGoal, deleteSavingGoalTransaction, getSavingGoalSemesterTransactions, getSavingGoalTransactions, SavingGoalDetail, SavingGoalSemesterTransactions, SavingGoalTransactions, updateSavingsGoal } from "@/services/savingsService";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";


const SavingsGoalDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [savingsData, setSavingsData] = useState<SavingGoalDetail | null>(null);
  const [savingSemesterTransactions, setSavingSemesterTransactions] = useState<SavingGoalSemesterTransactions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isEditingTransaction, setIsEditingTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SavingGoalTransactions | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<SavingGoalTransactions | null>(null);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      if (!id) return;
      const data = await getSavingGoalTransactions(Number(id));
      setSavingsData(data);

      const savingSemesterTransactionsData = await getSavingGoalSemesterTransactions(Number(id));
      setSavingSemesterTransactions(savingSemesterTransactionsData);
    } catch (error) {
      console.error('Error loading savings goal details:', error);
      setError('Erro ao carregar detalhes da meta');
    } finally {
      setIsLoading(false);
    }
  };
  
  const transactionsChartData = useMemo(() => {
    if (!savingSemesterTransactions.length) return [];

    const monthNames = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return monthNames[date.getMonth()];
    });

    return last6Months.map(month => {
      const monthData = savingSemesterTransactions.find(t => t.month === month);

      return {
        name: month,
        entradas: monthData ? monthData.incomeValue : 0,
        saidas: monthData ? monthData.expenseValue : 0
      };
    });
  }, [savingSemesterTransactions]);

  const handleDeleteGoal = async () => {
    try {
      if (!savingsData?.id) return;
      await deleteSavingsGoal(savingsData.id);
      navigate(-1);
    } catch (error) {
      console.error("Error deleting savings goal:", error);
      setError("Erro ao deletar meta de economia");
    }
  };

  const handleUpdateGoal = async (updatedGoalData: {
    name: string;
    savingsTargetValue?: number;
    savingsDueDate?: string;    
  }) => {

    try {
      console.log("Atualizando meta:", { id: savingsData?.id, ...updatedGoalData });
      await updateSavingsGoal(savingsData?.id, updatedGoalData);
      loadData();
    } catch (error) {
      console.error("Error updating savings goal:", error);
      setError("Erro ao atualizar meta de economia");
    } finally {
      setIsEditingGoal(false);
    }
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

  const handleEditTransaction = (transaction: SavingGoalTransactions) => {
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

  const handleDeleteTransaction = async (transactionId: number) => {
    try {
      if (!savingsData?.id) return;
      await deleteSavingGoalTransaction(savingsData.id, transactionId);
      await loadData(); // Recarrega os dados após deletar
      setTransactionToDelete(null);
    } catch (error) {
      console.error("Erro ao deletar transação:", error);
      setError("Erro ao deletar transação");
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const progressPercentage = savingsData?.savingTargetValue 
    ? calculateProgress(savingsData.current, savingsData.savingTargetValue)
    : null;

  const expectedCompletionDate = (savingsData?.savingTargetValue && savingsData?.lastSaved)
    ? calculateExpectedCompletion(savingsData.current, savingsData.savingTargetValue, savingsData.lastSaved)
    : null;

      let statusLabel = "";
      if (savingsData?.savingTargetValue && savingsData?.savingDueDate && expectedCompletionDate) {
        const dueDate = new Date(savingsData.savingDueDate);
        if (expectedCompletionDate > dueDate) {
          statusLabel = "Atrasada";
        } else if (expectedCompletionDate < dueDate) {
          statusLabel = "Adiantada";
        } else {
          statusLabel = "No prazo";
        }
      }

      
  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (!savingsData) {
    return <Error message="Meta não encontrada" />;
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
              <h2 className="text-xl font-bold">{savingsData?.name ? `${savingsData.name}` : "Extrato da Meta"}</h2>
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
          {(savingsData.savingTargetValue || savingsData.savingDueDate) && (
            <Card className="border-none shadow-md overflow-hidden">
              <CardContent className="p-0">
                {/* Hero Section com Progresso */}
                {savingsData.savingTargetValue && (
                  <div className="bg-gradient-to-b from-primary/5 to-transparent px-4 pt-6 pb-2">
                    <div className="flex flex-col items-center mb-4">
                      <span className="text-3xl font-bold text-foreground mb-1">
                        {formatCurrency(savingsData.current)}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>de</span>
                        <span>{formatCurrency(savingsData.savingTargetValue)}</span>
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
                          Faltam {formatCurrency(savingsData.savingTargetValue - savingsData.current)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Datas */}
                <div className="px-4 py-4 grid grid-cols-2 gap-4">
                  {savingsData.savingDueDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Data Final</span>
                        <span className="text-sm font-semibold">{formatDate(savingsData.savingDueDate)}</span>
                      </div>
                    </div>
                  )}
                  {expectedCompletionDate && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className={`h-4 w-4 ${savingsData.savingDueDate && expectedCompletionDate > new Date(savingsData.savingDueDate) ? 'text-red-500' : 'text-primary'}`} />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Previsão</span>
                        <span className={`text-sm font-semibold ${savingsData.savingDueDate && expectedCompletionDate > new Date(savingsData.savingDueDate) ? 'text-red-500' : ''}`}>
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
              {savingsData.transactions.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma movimentação registrada.</p>
              ) : (
                savingsData.transactions.map((item) => (
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
          goalName={savingsData?.name || ''}
        />

        <SavingsGoalModal 
          open={isEditingGoal}
          onClose={() => setIsEditingGoal(false)}
          onSubmit={handleUpdateGoal}
          initialData={savingsData ? {
            name: savingsData.name,
            savingTargetValue: savingsData.savingTargetValue,
            savingDueDate: savingsData.savingDueDate
          } : undefined}
          mode="edit"
        />
      </div>
    </>
  );
};

export default SavingsGoalDetails;
