"use client";

import { useMemo } from "react";
import { Brain, CalendarDays, Repeat } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/utils/format";
import { Expense } from "@/utils/storage";

type SmartInsightsProps = {
  expenses: Expense[];
};

const getMonthKey = (date: Date) => date.toISOString().slice(0, 7);

export default function SmartInsights({ expenses }: SmartInsightsProps) {
  const insights = useMemo(() => {
    const now = new Date();
    const currentMonth = getMonthKey(now);
    const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonth = getMonthKey(previousMonthDate);

    const foodCurrent = expenses
      .filter((expense) => expense.date.startsWith(currentMonth) && expense.category.toLowerCase() === "food")
      .reduce((sum, expense) => sum + expense.amount, 0);

    const foodPrevious = expenses
      .filter((expense) => expense.date.startsWith(previousMonth) && expense.category.toLowerCase() === "food")
      .reduce((sum, expense) => sum + expense.amount, 0);

    const foodDeltaPercent =
      foodPrevious > 0 ? ((foodCurrent - foodPrevious) / foodPrevious) * 100 : foodCurrent > 0 ? 100 : 0;

    const mostExpensiveExpense = expenses.reduce<Expense | null>(
      (max, expense) => (!max || expense.amount > max.amount ? expense : max),
      null
    );

    const mostExpensiveDay = mostExpensiveExpense
      ? new Date(mostExpensiveExpense.date).toLocaleDateString("en-IN", { weekday: "long" })
      : "N/A";

    const merchantMap = expenses.reduce<Record<string, { count: number; display: string }>>((acc, expense) => {
      const key = expense.title.trim().toLowerCase();
      if (!key) return acc;

      if (!acc[key]) {
        acc[key] = { count: 0, display: expense.title.trim() };
      }
      acc[key].count += 1;
      return acc;
    }, {});

    const topRecurring = Object.values(merchantMap)
      .filter((item) => item.count > 1)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      foodCurrent,
      foodPrevious,
      foodDeltaPercent,
      mostExpensiveDay,
      mostExpensiveExpense,
      topRecurring
    };
  }, [expenses]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Smart Insights</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Brain size={16} />
            Food Spend Intelligence
          </p>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
            You spent{" "}
            <span className="font-semibold">
              {Math.abs(insights.foodDeltaPercent).toFixed(0)}%{" "}
              {insights.foodDeltaPercent >= 0 ? "more" : "less"}
            </span>{" "}
            on Food vs last month.
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Current: {formatCurrency(insights.foodCurrent)} • Previous: {formatCurrency(insights.foodPrevious)}
          </p>
        </Card>

        <Card>
          <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <CalendarDays size={16} />
            Most Expensive Day
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{insights.mostExpensiveDay}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Highest transaction:{" "}
            {insights.mostExpensiveExpense ? formatCurrency(insights.mostExpensiveExpense.amount) : "No data"}
          </p>
        </Card>

        <Card>
          <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Repeat size={16} />
            Top Recurring Merchants
          </p>
          <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
            {insights.topRecurring.length > 0 ? (
              insights.topRecurring.map((merchant) => (
                <li key={merchant.display} className="flex justify-between">
                  <span>{merchant.display}</span>
                  <span className="text-xs text-slate-500">{merchant.count}x</span>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-500 dark:text-slate-400">Not enough repeated merchants yet.</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
