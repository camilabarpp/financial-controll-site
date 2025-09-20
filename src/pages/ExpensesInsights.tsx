import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { FaWallet, FaChartPie, FaCalendarAlt } from "react-icons/fa";
import { formatCurrency } from "@/utils/format-currency";
import { getExpensesInsights, ExpensesInsightsData } from "@/services/expensesInsightsService";

const ExpensesInsights = () => {
  const [period, setPeriod] = useState("month");
  const [data, setData] = useState<ExpensesInsightsData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const insightsData = await getExpensesInsights(period);
      setData(insightsData);
    };
    loadData();
  }, [period]);

  if (!data) {
    return <div>Carregando...</div>;
  }

  const totalExpenses = data.expenseCategory.reduce((sum, item) => sum + item.expenses, 0);
  const total6Months = data.semesterExpense.reduce((sum, item) => sum + item.expenses, 0);

  const calculatePercentage = (value: number) => {
    return ((value / totalExpenses) * 100).toFixed(1);
  };

  const infoCards = [
    {
      icon: <FaWallet className="text-primary text-xl" />,
      label: "Total gasto",
      value: formatCurrency(data.totalExpenses),
    },
    {
      icon: <FaChartPie className="text-primary text-xl" />,
      label: "Categorias",
      value: `${data.categoriesCount}`,
    },
    {
      icon: <FaCalendarAlt className="text-primary text-xl" />,
      label: "Período",
      value: period === "month" ? "Este mês" : period === "week" ? "Esta semana" : period === "day" ? "Hoje" : "Este ano",
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
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Hoje</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                    <SelectItem value="year">Este ano</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Hoje</SelectItem>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                    <SelectItem value="year">Este ano</SelectItem>
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
            {data.expenseCategory.map((category, index) => (
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
            <CardTitle className="text-lg">Gastos nos últimos 6 meses</CardTitle>
            <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl border border-border/5 shadow-sm flex items-center gap-3">
              <FaWallet className="text-primary text-xl" />
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">{formatCurrency(total6Months)}</span>
                <span className="text-sm text-muted-foreground">BRL</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.semesterExpense}>
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