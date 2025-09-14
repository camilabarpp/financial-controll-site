export const calculateMonthsToGoal = (current: number, target?: number, monthly?: number) => {
  if (!target || !monthly) return undefined;
  const remaining = target - current;
  if (remaining <= 0) return 0;
  return Math.ceil(remaining / monthly);
};
