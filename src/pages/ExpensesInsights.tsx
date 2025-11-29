import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { FaWallet, FaChartPie, FaCalendarAlt } from "react-icons/fa";
import { formatCurrency } from "@/utils/format-currency";
import { getExpensesInsights, ExpensesInsightsData } from "@/services/expensesInsightsService";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { useResetScroll } from "@/hooks/useResetScroll";

const ExpensesInsights = () => {
  useResetScroll();
  type Period = "WEEK" | "MONTH" | "QUARTER" | "YEAR";
  const [period, setPeriod] = useState<Period>("MONTH");
  const [expenses, setExpenses] = useState<ExpensesInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const insightsData = await getExpensesInsights(period);
      setExpenses(insightsData);
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (!expenses) {
    return <Error message="Nenhum dado encontrado" />;
  }

  const totalExpenses = expenses.expenseCategory.reduce((sum, item) => sum + item.expenses, 0);
  const groupedExpenses = expenses.lastSixMonthsExpenses.reduce((sum, item) => sum + item.expenses, 0);

  const calculatePercentage = (value: number) => {
    return ((value / totalExpenses) * 100).toFixed(1);
  };

  const infoCards = [
    {
      icon: <FaWallet className="text-primary text-xl" />,
      label: "Total gasto",
      value: formatCurrency(expenses.totalExpenses),
    },
    {
      icon: <FaChartPie className="text-primary text-xl" />,
      label: "Categorias",
      value: `${expenses.categoriesCount}`,
    },
    {
      icon: <FaCalendarAlt className="text-primary text-xl" />,
      label: "Período",
      value: period === "WEEK" ? "Esta semana" : period === "MONTH" ? "Este mês" : period === "QUARTER" ? "Este trimestre" : "Este ano",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 pb-20">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="pt-4 pb-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Gastos</h1>
          <p className="text-muted-foreground text-base">Análise dos seus gastos</p>
        </div>

        <div className="hidden sm:block">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">Resumo</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {infoCards.map((card, idx) => (
                  <Card key={idx} className="shadow-md border-none bg-gradient-to-br from-primary/10 to-background">
                    <CardContent className="flex items-center gap-3 py-4">
                      {card.icon}
                      <div>
                        <span className="block text-sm text-muted-foreground">{card.label}</span>
                        <span className="block text-lg font-bold text-foreground">{card.value}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Gastos por Categoria</CardTitle>
                  <Select value={period} onValueChange={(value) => setPeriod(value as Period)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEEK">Esta semana</SelectItem>
                    <SelectItem value="MONTH">Este mês</SelectItem>
                    <SelectItem value="QUARTER">Este trimestre</SelectItem>
                    <SelectItem value="YEAR">Este ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl border border-border/5 shadow-sm">
                <div className="flex items-center gap-3">
                  <FaWallet className="text-primary text-xl" />
                  <div>
                    <span className="block text-sm font-medium text-muted-foreground">Total no período</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold tracking-tight">{formatCurrency(totalExpenses)}</span>
                      <span className="text-sm text-muted-foreground">BRL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {expenses.expenseCategory.map((category, index) => (
              <div key={index} className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-primary/5 transition">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-5 h-5 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-foreground">{category.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{calculatePercentage(category.expenses)}%</p>
                  <p className="font-bold text-foreground">{formatCurrency(category.expenses)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Gráfico de gastos durante o semestre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenses.lastSixMonthsExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar 
                    dataKey="expenses" 
                    fill="hsl(var(--primary))"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpensesInsights;