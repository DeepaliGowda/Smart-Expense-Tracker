"use client";

import { useMemo } from "react";
import { Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/utils/format";
import { Expense } from "@/utils/storage";

type MonthlyMoneyStoryProps = {
  expenses: Expense[];
  selectedMonth: string;
  selectedCategory: string;
};

const getMonthKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

export default function MonthlyMoneyStory({
  expenses,
  selectedMonth,
  selectedCategory
}: MonthlyMoneyStoryProps) {
  const story = useMemo(() => {
    const baseDate = selectedMonth
      ? new Date(Number(selectedMonth.split("-")[0]), Number(selectedMonth.split("-")[1]) - 1, 1)
      : new Date();
    const monthKey = getMonthKey(baseDate);
    const monthLabel = baseDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

    const scopedExpenses =
      selectedCategory === "All"
        ? expenses
        : expenses.filter((expense) => expense.category === selectedCategory);

    const monthlyExpenses = scopedExpenses.filter((expense) => expense.date.startsWith(monthKey));
    const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categoryTotals = monthlyExpenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
      return acc;
    }, {});

    const topCategory =
      Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      (selectedCategory !== "All" ? selectedCategory : "N/A");

    const weekendEntries = monthlyExpenses.filter((expense) => {
      const day = new Date(expense.date).getDay();
      return day === 0 || day === 6;
    });
    const weekdayEntries = monthlyExpenses.filter((expense) => {
      const day = new Date(expense.date).getDay();
      return day !== 0 && day !== 6;
    });

    const weekendTotal = weekendEntries.reduce((sum, expense) => sum + expense.amount, 0);
    const weekdayTotal = weekdayEntries.reduce((sum, expense) => sum + expense.amount, 0);

    const weekendAvg = weekendEntries.length ? weekendTotal / weekendEntries.length : 0;
    const weekdayAvg = weekdayEntries.length ? weekdayTotal / weekdayEntries.length : 0;

    const weekendDeltaPercent =
      weekdayAvg > 0 ? ((weekendAvg - weekdayAvg) / weekdayAvg) * 100 : weekendAvg > 0 ? 100 : 0;

    return {
      monthLabel,
      monthlyTotal,
      topCategory,
      weekendDeltaPercent,
      hasData: monthlyExpenses.length > 0
    };
  }, [expenses, selectedMonth, selectedCategory]);

  return (
    <Card className="space-y-2">
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <Sparkles size={16} className="text-indigo-500" />
        Monthly Money Story
      </p>
      {story.hasData ? (
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-200">
          In <span className="font-semibold">{story.monthLabel}</span>, you spent{" "}
          <span className="font-semibold">{formatCurrency(story.monthlyTotal)}</span>, top category was{" "}
          <span className="font-semibold">{story.topCategory}</span>, and weekends were{" "}
          <span className="font-semibold">{Math.abs(story.weekendDeltaPercent).toFixed(0)}%</span>{" "}
          {story.weekendDeltaPercent >= 0 ? "higher" : "lower"} than weekdays.
        </p>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No expense data available for this month and filter combination.
        </p>
      )}
    </Card>
  );
}
