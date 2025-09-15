import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Eye, EyeOff, PiggyBank, Wallet, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format-currency";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/format-date";

const Dashboard = () => {
  const [showBalance, setShowBalance] = useState(false);
  
  // Mock data
  const balance = {
    total: 4567.89,
    income: 8500.00,
    expenses: 3932.00,
    available: 456700.00,
    saved: 60000.00
  };

  const recentTransactions = [
    { id: 1, description: "Salário", amount: 850000, category: "Renda", date: "2024-09-10", type: "income" },
    { id: 2, description: "Mercado Unisuper", amount: 125.50, category: "Alimentação", date: "2024-09-09", type: "expense" },
    { id: 3, description: "Netflix", amount: 29.90, category: "Entretenimento", date: "2024-09-08", type: "expense" },
    { id: 4, description: "Freelance", amount: 450.00, category: "Renda", date: "2024-09-07", type: "income" },
    { id: 5, description: "Gasolina", amount: 89.90, category: "Transporte", date: "2024-09-06", type: "expense" },
  ];

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

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="space-y-6">
        <div className="flex items-center justify-between pt-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Olá, João!</h1>
            <p className="text-muted-foreground">Bem-vindo de volta</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBalance(!showBalance)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-90">Saldo Total</CardTitle>
            <div className="text-3xl font-bold">
              {showBalance ? formatCurrency(balance.total) : '••••••'}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-positive">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-medium">Entradas</span>
              </div>
              <div className="text-xl font-bold text-foreground mt-1">
                {showBalance ? formatCurrency(balance.income) : '••••••'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-negative">
                <ArrowDownRight className="h-4 w-4" />
                <span className="text-sm font-medium">Saídas</span>
              </div>
              <div className="text-xl font-bold text-foreground mt-1">
                {showBalance ? formatCurrency(balance.expenses) : '••••••'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Balance */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">Saldo Livre</span>
              </div>
              <div className="text-lg font-bold text-foreground">
                {showBalance ? formatCurrency(balance.available) : '••••••'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors relative">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {transaction.type === 'income' ? 
                      <ArrowUpRight className="h-4 w-4 text-positive" /> : 
                      <ArrowDownRight className="h-4 w-4 text-negative" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 min-w-0">
                        <p className="font-medium text-foreground truncate pr-4">
                          {transaction.description}
                        </p>
                        <Badge 
                          className={`text-xs px-2 py-0.5 truncate max-w-[100px] ${getCategoryColor(transaction.category)}`}
                          variant="secondary"
                        >
                          {transaction.category}
                        </Badge>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <span className="text-xs text-muted-foreground block mb-1">
                          {formatDate(transaction.date)}
                        </span>
                        <div className={`font-bold whitespace-nowrap truncate max-w-[120px] ${
                          transaction.type === 'income' ? 'text-positive' : 'text-negative'
                        }`}>
                          {formatCurrency(transaction.amount)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t">
            <Link to="/transactions">
              <Button variant="ghost" className="w-full justify-between">
                Ver todas as transações
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;