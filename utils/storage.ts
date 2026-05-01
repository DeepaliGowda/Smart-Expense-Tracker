export type Expense = {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
};

const STORAGE_KEY = "smart-expense-tracker-expenses";

export const getStoredExpenses = (): Expense[] => {
  if (typeof window === "undefined") return [];

  const rawExpenses = window.localStorage.getItem(STORAGE_KEY);
  if (!rawExpenses) return [];

  try {
    const parsed = JSON.parse(rawExpenses) as Expense[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const setStoredExpenses = (expenses: Expense[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
};
