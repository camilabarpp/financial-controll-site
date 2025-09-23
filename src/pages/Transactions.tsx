import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, Filter, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { TransactionModal } from "@/components/TransactionModal";
import { DeleteTransactionModal } from "@/components/DeleteTransactionModal";
import { Pencil, Trash2 } from "lucide-react";
import { createTransaction, deleteTransaction, getAllTransactions, getTransactionTotals, Transaction, TransactionTotals, updateTransaction, SortOrder } from "@/services/transactionsService";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { useResetScroll } from "@/hooks/useResetScroll";

export const Transactions = () => {
  useResetScroll();
  const [filter, setFilter] = useState("all");
  type Period = "WEEK" | "MONTH" | "QUARTER" | "YEAR";
  const [period, setPeriod] = useState<Period>("MONTH");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingTransaction, setIsEditingTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState<TransactionTotals | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    loadData();
  }, [period, debouncedSearchTerm, sortOrder]); 

  const loadData = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      setTransactionToDelete(null);
      setIsEditingTransaction(false);
      const [transactionsData, totalsData] = await Promise.all([
        getAllTransactions(period, debouncedSearchTerm, sortOrder),
        getTransactionTotals(period)
      ]);
      setTransactions(transactionsData);
      setTotals(totalsData);
    } catch (error) {
      console.error('Error loading transactions data:', error);
      setError('Erro ao carregar transações');
    } finally {
      setIsLoading(false);
    }
  }, [period, debouncedSearchTerm, sortOrder]);

  const filteredTransactions = transactions.filter(transaction => {
    return filter === "all" || transaction.type === filter;
  });

  const getTransactionIcon = (type: string) => {
    return type === "INCOME" ? 
      <ArrowUpRight className="h-4 w-4 text-positive" /> : 
      <ArrowDownRight className="h-4 w-4 text-negative" />;
  };

  const totalIncome = totals?.income || 0;
  const totalExpenses = totals?.expenses || 0;

  const handleSubmit = async (transactionData: {
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    date: string;
    category: string;
    categoryColor: string;
  }) => {
    try {
      setIsLoading(true);
      if (isEditingTransaction && selectedTransaction) {
        await updateTransaction(selectedTransaction.id, transactionData);
      } else {
        await createTransaction(transactionData);
      }
      await loadData();
      setIsModalOpen(false);
      setIsEditingTransaction(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
      setError('Erro ao salvar transação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (transactionToDelete) {
        setIsLoading(true);
        await deleteTransaction(transactionToDelete.id);
        await loadData();
        setTransactionToDelete(null);
        setSelectedTransaction(null);
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      setError('Erro ao deletar transação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditingTransaction(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="space-y-6">
        <div className="flex items-center justify-between pt-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transações</h1>
            <p className="text-muted-foreground">Histórico completo</p>
          </div>
          <Button size="icon" className="rounded-full" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 text-positive">
                  <ArrowUpRight className="h-4 w-4" />
                  <span className="text-sm font-medium">Receitas</span>
                </div>
                <div className="text-lg font-bold text-foreground mt-1">
                  {formatCurrency(totalIncome)}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 text-negative">
                  <ArrowDownRight className="h-4 w-4" />
                  <span className="text-sm font-medium">Despesas</span>
                </div>
                <div className="text-lg font-bold text-foreground mt-1">
                  {formatCurrency(totalExpenses)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtros</span>
              </div>
              <div className="space-y-2 w-full">
                <input
                  type="text"
                  placeholder="Buscar por descrição ou categoria..."
                  className="w-full border rounded-lg px-3 py-2 bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="grid grid-cols-3 gap-2">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="INCOME">Receitas</SelectItem>
                      <SelectItem value="EXPENSE">Despesas</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={period}
                    onValueChange={(value) => setPeriod(value as Period)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WEEK">Semana</SelectItem>
                      <SelectItem value="MONTH">Mês</SelectItem>
                      <SelectItem value="QUARTER">Trimestre</SelectItem>
                      <SelectItem value="YEAR">Ano</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value as SortOrder)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>Ordernar por</SelectItem>
                      <SelectItem value="DESC">Maior valor</SelectItem>
                      <SelectItem value="ASC">Menor valor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Histórico ({filteredTransactions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className={`group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer
                  ${selectedTransaction?.id === transaction.id ? 'bg-primary/5' : ''}`}
                onClick={() => setSelectedTransaction(selectedTransaction?.id === transaction.id ? null : transaction)}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        className={`text-xs px-2 py-0.5 truncate max-w-[100px]`}
                        style={{ 
                          backgroundColor: transaction.categoryColor,
                          color: '#FFFFFF'
                         }}>
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                  {selectedTransaction?.id !== transaction.id ? (
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className="text-xs text-muted-foreground block mb-1">
                        {formatDate(transaction.date)}
                      </span>
                      <div className={`font-bold whitespace-nowrap truncate max-w-[120px] ${
                        transaction.type === 'INCOME' ? 'text-positive' : 'text-negative'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(transaction);
                        }}
                        className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        <Pencil className="h-4 w-4 text-primary" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTransactionToDelete(transaction);
                        }}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <TransactionModal
        open={isModalOpen || isEditingTransaction}
        onClose={() => {
          setIsModalOpen(false);
          setIsEditingTransaction(false);
          setSelectedTransaction(null);
        }}
        categories={Array.from(new Set(transactions.map(t => t.category)))}
        onSubmit={handleSubmit}
        mode={isEditingTransaction ? 'edit' : 'create'}
        initialData={selectedTransaction ? {
          description: selectedTransaction.description,
          amount: selectedTransaction.amount,
          type: selectedTransaction.type,
          date: selectedTransaction.date,
          category: selectedTransaction.category
        } : undefined}
      />

      <DeleteTransactionModal
        open={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};