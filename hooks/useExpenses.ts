"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Expense, getStoredExpenses, setStoredExpenses } from "@/utils/storage";

type UseExpensesResult = {
  expenses: Expense[];
  isLoading: boolean;
  saveExpense: (expense: Expense, isEditing: boolean) => void;
  deleteExpense: (id: string) => void;
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
      setExpenses(getStoredExpenses());
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

  return useMemo(
    () => ({
      expenses,
      isLoading,
      saveExpense,
      deleteExpense,
      editingExpense,
      setEditingExpense
    }),
    [expenses, isLoading, saveExpense, deleteExpense, editingExpense]
  );
};
