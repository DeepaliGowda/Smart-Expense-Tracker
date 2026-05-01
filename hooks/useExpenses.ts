"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Expense, getStoredExpenses, setStoredExpenses } from "@/utils/storage";

type UseExpensesResult = {
  expenses: Expense[];
  isLoading: boolean;
  saveExpense: (expense: Expense, isEditing: boolean) => void;
  deleteExpense: (id: string) => void;
  markExpensePaid: (id: string) => void;
  ignoreExpenseForMonth: (id: string) => void;
  editingExpense: Expense | null;
  setEditingExpense: (expense: Expense | null) => void;
};

export const useExpenses = (): UseExpensesResult => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    // Small delay keeps skeletons visible and avoids abrupt content pop-in.
    const timer = window.setTimeout(() => {
      const storedExpenses = getStoredExpenses();
      setExpenses(ensureCurrentMonthRecurringEntries(storedExpenses));
      setIsLoading(false);
    }, 350);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    setStoredExpenses(expenses);
  }, [expenses, isLoading]);

  const saveExpense = useCallback((expense: Expense, isEditing: boolean) => {
    setExpenses((prev) => {
      const existing = prev.some((item) => item.id === expense.id);
      return existing ? prev.map((item) => (item.id === expense.id ? expense : item)) : [expense, ...prev];
    });

    setEditingExpense(null);
    toast.success(isEditing ? "Expense updated successfully" : "Expense added successfully");
  }, []);

  const deleteExpense = useCallback(
    (id: string) => {
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));

      if (editingExpense?.id === id) {
        setEditingExpense(null);
      }

      toast.success("Expense deleted");
    },
    [editingExpense]
  );

  const markExpensePaid = useCallback((id: string) => {
    setExpenses((prev) => prev.map((expense) => (expense.id === id ? { ...expense, isPaid: true } : expense)));
    toast.success("Marked as paid");
  }, []);

  const ignoreExpenseForMonth = useCallback((id: string) => {
    setExpenses((prev) => prev.map((expense) => (expense.id === id ? { ...expense, isIgnored: true } : expense)));
    toast.success("Ignored for this month");
  }, []);

  return useMemo(
    () => ({
      expenses,
      isLoading,
      saveExpense,
      deleteExpense,
      markExpensePaid,
      ignoreExpenseForMonth,
      editingExpense,
      setEditingExpense
    }),
    [expenses, isLoading, saveExpense, deleteExpense, markExpensePaid, ignoreExpenseForMonth, editingExpense]
  );
};

const ensureCurrentMonthRecurringEntries = (expenses: Expense[]) => {
  const now = new Date();
  const monthKey = now.toISOString().slice(0, 7);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const recurringSeries = new Map<string, Expense>();
  for (const expense of expenses) {
    if (!expense.isRecurring || expense.recurrence !== "monthly") continue;
    const sourceId = expense.recurringSourceId ?? expense.id;
    const existing = recurringSeries.get(sourceId);
    if (!existing || existing.date < expense.date) {
      recurringSeries.set(sourceId, expense);
    }
  }

  if (recurringSeries.size === 0) return expenses;

  const additions: Expense[] = [];

  for (const [sourceId, template] of recurringSeries.entries()) {
    const baseDate = new Date(template.date);
    const preferredDay = Math.min(template.dueDay ?? baseDate.getDate(), daysInMonth);
    const targetDate = `${monthKey}-${String(preferredDay).padStart(2, "0")}`;

    const existsInMonth = expenses.some(
      (item) =>
        (item.recurringSourceId ?? item.id) === sourceId &&
        item.date.startsWith(monthKey) &&
        item.date === targetDate
    );

    if (existsInMonth) continue;

    additions.push({
      ...template,
      id: crypto.randomUUID(),
      date: targetDate,
      recurringSourceId: sourceId,
      dueDay: preferredDay,
      isRecurring: true,
      recurrence: "monthly"
    });
  }

  return additions.length > 0 ? [...additions, ...expenses] : expenses;
};
