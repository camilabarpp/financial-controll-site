import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, Filter, ArrowUpRight, ArrowDownRight, Calendar } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { TransactionModal } from "@/components/TransactionModal";
import { DeleteTransactionModal } from "@/components/DeleteTransactionModal";
import { Pencil, Trash2 } from "lucide-react";

export const Transactions = () => {
  const [filter, setFilter] = useState("all");
  const [period, setPeriod] = useState("month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingTransaction, setIsEditingTransaction] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  type TransactionType = "INCOME" | "EXPENSE";

  interface Transaction {
    id: number;
    description: string;
    amount: number;
    category: string;
    date: string;
    type: TransactionType;
  }

  // Mock transactions data
  const allTransactions: Transaction[] = [
    { id: 1, description: "Salário", amount: 8500.00, category: "Renda", date: "2024-09-10", type: "INCOME" },
    { id: 2, description: "Supermercado Extra", amount: 125.50, category: "Alimentação", date: "2024-09-09", type: "EXPENSE" },
    { id: 3, description: "Netflix", amount: 29.90, category: "Entretenimento", date: "2024-09-08", type: "EXPENSE" },
    { id: 4, description: "Freelance Design", amount: 450.00, category: "Renda", date: "2024-09-07", type: "INCOME" },
    { id: 5, description: "Posto Shell", amount: 89.90, category: "Transporte", date: "2024-09-06", type: "EXPENSE" },
    { id: 6, description: "Academia", amount: 79.90, category: "Saúde", date: "2024-09-05", type: "EXPENSE" },
    { id: 7, description: "Pix Recebido", amount: 200.00, category: "Transferência", date: "2024-09-04", type: "INCOME" },
    { id: 8, description: "iFood", amount: 35.60, category: "Alimentação", date: "2024-09-03", type: "EXPENSE" },
    { id: 9, description: "Farmácia", amount: 45.80, category: "Saúde", date: "2024-09-02", type: "EXPENSE" },
    { id: 10, description: "Uber", amount: 18.50, category: "Transporte", date: "2024-09-01", type: "EXPENSE" },
    { id: 11, description: "Spotify", amount: 21.90, category: "Entretenimento", date: "2024-08-31", type: "EXPENSE" },
    { id: 12, description: "Cashback", amount: 15.20, category: "Outros", date: "2024-08-30", type: "INCOME" },
  ];

  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesType = filter === "all" || transaction.type === filter;
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = searchTerm === "" || 
      transaction.description.toLowerCase().includes(searchTermLower) ||
      transaction.category.toLowerCase().includes(searchTermLower);
    return matchesType && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Renda": "bg-positive text-primary-foreground",
      "Alimentação": "bg-primary text-primary-foreground",
      "Entretenimento": "bg-accent text-accent-foreground",
      "Transporte": "bg-secondary text-secondary-foreground",
      "Saúde": "bg-success text-success-foreground",
      "Transferência": "bg-muted text-muted-foreground",
      "Outros": "bg-neutral text-foreground"
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  const getTransactionIcon = (type: string) => {
    return type === "INCOME" ? 
      <ArrowUpRight className="h-4 w-4 text-positive" /> : 
      <ArrowDownRight className="h-4 w-4 text-negative" />;
  };



  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transações</h1>
            <p className="text-muted-foreground">Histórico completo</p>
          </div>
          <Button size="icon" className="rounded-full" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Summary */}
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

        {/* Filters */}
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
                <div className="grid grid-cols-2 gap-2">
                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="INCOME">Receitas</SelectItem>
                      <SelectItem value="EXPENSE">Despesas</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">Semana</SelectItem>
                      <SelectItem value="month">Mês</SelectItem>
                      <SelectItem value="quarter">Trimestre</SelectItem>
                      <SelectItem value="year">Ano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Histórico ({filteredTransactions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
                        className={`text-xs px-2 py-0.5 truncate max-w-[100px] ${getCategoryColor(transaction.category)}`}
                      >
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
                          setIsEditingTransaction(true);
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
        categories={Array.from(new Set(allTransactions.map(t => t.category)))}
        onSubmit={(transaction) => {
          // Aqui você implementará a lógica para adicionar/editar a transação
          console.log(isEditingTransaction ? 'Editando transação:' : 'Nova transação:', transaction);
          setIsModalOpen(false);
          setIsEditingTransaction(false);
          setSelectedTransaction(null);
        }}
        mode={isEditingTransaction ? 'edit' : 'create'}
        initialData={isEditingTransaction && selectedTransaction ? {
          description: selectedTransaction.description,
          value: selectedTransaction.amount,
          type: selectedTransaction.type,
          date: selectedTransaction.date,
          category: selectedTransaction.category
        } : undefined}
      />

      <DeleteTransactionModal
        open={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        onConfirm={() => {
          // Aqui você implementará a lógica para excluir a transação
          console.log('Excluindo transação:', transactionToDelete);
          setTransactionToDelete(null);
          setSelectedTransaction(null);
        }}
      />
    </div>
  );
};