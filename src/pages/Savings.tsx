import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Target, TrendingUp, Plus, Wallet, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SavingsGoalModal } from "@/components/SavingsGoalModal";
import { formatCurrency } from "@/utils/format-currency";
import { formatTimeRemaining } from "@/utils/format-time-remaining";
import { formatDate } from "@/utils/format-date";
import { calculateExpectedCompletion } from "@/utils/calculate-expected-saving_goal_completion";

const Savings = () => {

  interface SavingsGoal {
    id: number;
    name: string;
    savingsTargetValue?: number;
    current: number;
    lastSaved?: number;
    savingsDueDate?: string;
  }

  const savingsGoals: SavingsGoal[] = [
    {
      id: 1,
      name: "Viagem Europa",
      savingsTargetValue: 15000,
      current: 8750,
      lastSaved: 1250,
      savingsDueDate: "2027-09-20T00:00:00.000Z"
    },
    {
      id: 2,
      name: "Emergência",
      lastSaved: 2000,
      current: 12400
    },
    {
      id: 3,
      name: "Casa Nova",
      savingsTargetValue: 80000,
      current: 35000,
      lastSaved: 2500
    },
    {
      id: 4,
      name: "Carro Novo",
      savingsDueDate: "2026-12-31T00:00:00.000Z",
      current: 15750,
      savingsTargetValue: 45000,
      lastSaved: 3000.00
    }
  ];

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

  const getTotalSavings = () => {
    return savingsGoals.reduce((total, goal) => total + goal.current, 0);
  };

  const getTotalIncome = () => {
    const thisMonth = new Date().getMonth();
    return savingsGoals.reduce((total, goal) => total + (goal.lastSaved || 0), 0);
  };

  const getTotalExpenses = () => {
    // Em um cenário real, você teria um histórico de retiradas
    // Por enquanto vamos simular um valor
    return 1500;
  };

  const navigate = useNavigate();
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  const handleAddGoal = (goalData: {
    name: string;
    savingsTargetValue?: number;
    savingsDueDate?: string;
  }) => {
    console.log('Nova meta:', goalData);
    setIsAddingGoal(false);
  };

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
                  {formatCurrency(getTotalSavings())}
                </span>
              </div>
              <div className="flex justify-between mt-4 gap-4">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-xs text-primary-foreground/80">Aportes do Mês</p>
                    <p className="font-medium text-primary-foreground">{formatCurrency(getTotalIncome())}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-xs text-primary-foreground/80">Retiradas do Mês</p>
                    <p className="font-medium text-primary-foreground">{formatCurrency(getTotalExpenses())}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


        <div className="space-y-4">
          {savingsGoals.map((goal) => {
            const progress = calculateProgress(goal.current, goal.savingsTargetValue);
            const isCompleted = progress !== undefined && progress >= 100;
            const hasTarget = goal.savingsTargetValue !== undefined;
            
            return (
              <Card key={goal.id} className="overflow-hidden cursor-pointer" onClick={() => navigate(`/savings/${goal.id}`)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        {goal.savingsDueDate && !isCompleted && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                              {formatTimeRemaining(goal.savingsDueDate)}
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
                          {formatCurrency(goal.savingsTargetValue)}
                        </span>
                      </div>
                    </div>
                  )}
                  {hasTarget && goal.lastSaved && goal.lastSaved > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">
                          {goal.savingsDueDate ? "Previsão" : "Último aporte"}
                        </span>
                      </div>
                      <span className={`font-medium ${
                        goal.savingsDueDate && calculateExpectedCompletion(goal.current, goal.savingsTargetValue!, goal.lastSaved) && 
                        new Date(goal.savingsDueDate) < calculateExpectedCompletion(goal.current, goal.savingsTargetValue!, goal.lastSaved)!
                          ? "text-destructive"
                          : "text-foreground"
                      }`}>
                        {goal.savingsDueDate ? (
                          calculateExpectedCompletion(goal.current, goal.savingsTargetValue!, goal.lastSaved) ? 
                            formatDate(calculateExpectedCompletion(goal.current, goal.savingsTargetValue!, goal.lastSaved)!) :
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
                        ? formatCurrency(goal.savingsTargetValue - goal.current)
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