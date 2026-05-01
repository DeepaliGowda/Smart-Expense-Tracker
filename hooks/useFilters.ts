"use client";

import { useMemo, useState } from "react";
import { Expense } from "@/utils/storage";

const getMonthValue = (isoDate: string) => isoDate.slice(0, 7);

type UseFiltersResult = {
  selectedCategory: string;
  selectedMonth: string;
  setSelectedCategory: (value: string) => void;
  setSelectedMonth: (value: string) => void;
  filteredExpenses: Expense[];
};

export const useFilters = (expenses: Expense[]): UseFiltersResult => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("");

  const filteredExpenses = useMemo(
    () =>
      expenses.filter((expense) => {
        const categoryMatches = selectedCategory === "All" || expense.category === selectedCategory;
        const monthMatches = !selectedMonth || getMonthValue(expense.date) === selectedMonth;
        return categoryMatches && monthMatches;
      }),
    [expenses, selectedCategory, selectedMonth]
  );

  return {
    selectedCategory,
    selectedMonth,
    setSelectedCategory,
    setSelectedMonth,
    filteredExpenses
  };
};
