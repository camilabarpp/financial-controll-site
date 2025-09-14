import { addMonthsToDate } from "./format-date";

export const calculateExpectedCompletion = (current: number, target: number, lastSaved: number) => {
  if (lastSaved <= 0) return null;
  const remaining = target - current;
  const monthsRemaining = Math.ceil(remaining / lastSaved);
  const now = new Date();
  return addMonthsToDate(now, monthsRemaining);
};
