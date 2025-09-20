import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format-currency";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/format-date";
import { Balance, getBalance, getRecentTransactions, Transaction } from "@/services/transactionsService";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";

const Dashboard = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
          
      const [balanceData, transactionsData] = await Promise.all([
        getBalance(),
        getRecentTransactions()
      ]);
      
      setBalance(balanceData);
      setRecentTransactions(transactionsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setError('Erro ao carregar dados do painel');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
            <h1 className="text-2xl font-bold text-foreground">Olá, {user?.name?.split(' ')[0] || 'Usuário'}!</h1>
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
                    {transaction.type === 'INCOME' ? 
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
                          className="text-xs px-2 py-0.5 truncate max-w-[100px]"
                          variant="secondary"
                          style={{ 
                            backgroundColor: transaction.categoryColor,
                            color: '#FFFFFF'
                          }}
                        >
                          {transaction.category}
                        </Badge>
                      </div>
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