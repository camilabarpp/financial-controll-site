import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Plus, Wallet, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SavingsGoalModal } from "@/components/SavingsGoalModal";
import { formatCurrency } from "@/utils/format-currency";
import { formatTimeRemaining } from "@/utils/format-time-remaining";
import { formatDate } from "@/utils/format-date";
import { calculateExpectedCompletion } from "@/utils/calculate-expected-saving_goal_completion";
import { getAllSavingsGoals, getSavingsGoalTotals, createSavingsGoal, SavingsGoal, SavingsGoalTotals } from "@/services/savingsService";
import { Loading } from "@/components/ui/loading";
import { Error } from "@/components/ui/error";
import { useResetScroll } from "@/hooks/useResetScroll";

const Savings = () => {
  useResetScroll();
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [totals, setTotals] = useState<SavingsGoalTotals | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const [goalsData, totalsData] = await Promise.all([
        getAllSavingsGoals(),
        getSavingsGoalTotals()
      ]);
      setSavingsGoals(goalsData.savings);// todo paginar a tela de savings
      setTotals(totalsData);
    } catch (error) {
      console.error('Error loading savings data:', error);
      setError('Erro ao carregar dados das economias');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = async (goalData: {
    name: string;
    savingTargetValue?: number;
    savingDueDate?: string;
  }) => {
    try {
      setIsLoading(true);
      await createSavingsGoal(goalData);
      await loadData();
      setIsAddingGoal(false);
    } catch (error) {
      console.error('Error creating savings goal:', error);
      setError('Erro ao criar meta de economia');
    } finally {
      setIsAddingGoal(false);
      setIsLoading(false);
    }
  };

  const calculateProgress = (current: number, target?: number) => {
    if (!target) return undefined;
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress?: number) => {
    if (!progress) return "text-muted-foreground";
    if (progress >= 80) return "text-positive";
    if (progress >= 50) return "text-yellow-600";
    return "text-primary";
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <>
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="space-y-6">
          <div className="flex items-center justify-between pt-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Economias</h1>
            <p className="text-muted-foreground">Suas metas de economia</p>
          </div>
          <Button size="icon" className="rounded-full" onClick={() => setIsAddingGoal(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="relative overflow-hidden border-none">
            <div className="absolute inset-0 bg-primary/80" />
            <CardContent className="relative p-6">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-primary-foreground mb-1">
                  Total Acumulado
                </span>
                <span className="text-3xl font-bold text-primary-foreground">
                  {formatCurrency(totals.monthlyIncome || 0)}
                </span>
              </div>
              <div className="flex justify-between mt-4 gap-4">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-xs text-primary-foreground/80">Aportes do Mês</p>
                    <p className="font-medium text-primary-foreground">{formatCurrency(totals.monthlyIncome || 0)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-xs text-primary-foreground/80">Retiradas do Mês</p>
                    <p className="font-medium text-primary-foreground">{formatCurrency(totals.monthlyExpenses || 0)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        <div className="space-y-4">
          {savingsGoals.map((goal) => {
            const progress = calculateProgress(goal.current, goal.savingTargetValue);
            const isCompleted = progress !== undefined && progress >= 100;
            const hasTarget = goal.savingTargetValue !== undefined;
            
            return (
              <Card key={goal.id} className="overflow-hidden cursor-pointer" onClick={() => navigate(`/savings/${goal.id}`)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        {goal.savingDueDate && !isCompleted && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                              {formatTimeRemaining(goal.savingDueDate)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    {hasTarget && progress !== undefined && (
                      <div className="text-right">
                        <p className={`text-xl font-bold ${getProgressColor(progress)}`}>
                          {progress.toFixed(0)}%
                        </p>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasTarget && (
                    <div className="space-y-2">
                      <Progress 
                        value={progress} 
                        className="h-3"
                        style={{
                          backgroundColor: "hsl(var(--primary-transparent))"
                        }}
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground font-medium">
                          {formatCurrency(goal.current)}
                        </span>
                        <span className="text-muted-foreground">
                          {formatCurrency(goal.savingTargetValue)}
                        </span>
                      </div>
                    </div>
                  )}
                  {hasTarget && goal.lastSaved && goal.lastSaved > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">
                          {goal.savingDueDate ? "Previsão" : "Último aporte"}
                        </span>
                      </div>
                      <span className={`font-medium ${
                        goal.savingDueDate && calculateExpectedCompletion(goal.current, goal.savingTargetValue!, goal.lastSaved) && 
                        new Date(goal.savingDueDate) < calculateExpectedCompletion(goal.current, goal.savingTargetValue!, goal.lastSaved)!
                          ? "text-destructive"
                          : "text-foreground"
                      }`}>
                        {goal.savingDueDate ? (
                          calculateExpectedCompletion(goal.current, goal.savingTargetValue!, goal.lastSaved) ? 
                            formatDate(calculateExpectedCompletion(goal.current, goal.savingTargetValue!, goal.lastSaved)!) :
                            "Ritmo insuficiente"
                        ) : (
                          formatCurrency(goal.lastSaved)
                        )}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-positive" />
                      <span className="text-muted-foreground">
                        {hasTarget && !isCompleted ? "Faltam" : "Total"}
                      </span>
                    </div>
                    <span className="font-medium text-foreground">
                      {hasTarget && !isCompleted 
                        ? formatCurrency(goal.savingTargetValue - goal.current)
                        : formatCurrency(goal.current)
                      }
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      </div>
      <SavingsGoalModal
        open={isAddingGoal}
        onClose={() => setIsAddingGoal(false)}
        onSubmit={handleAddGoal}
      />
    </>
  );
};

export default Savings;