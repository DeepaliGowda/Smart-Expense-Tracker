"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Flag } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { formatCurrency } from "@/utils/format";
import { Expense } from "@/utils/storage";

type SavingsGoalsProps = {
  expenses: Expense[];
  selectedMonth: string;
  selectedCategory: string;
};

const GOAL_KEY = "smart-expense-savings-goal";

export default function SavingsGoals({ expenses, selectedMonth, selectedCategory }: SavingsGoalsProps) {
  const [goalAmount, setGoalAmount] = useState("10000");

  useEffect(() => {
    const rawGoal = window.localStorage.getItem(GOAL_KEY);
    if (rawGoal) setGoalAmount(rawGoal);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(GOAL_KEY, goalAmount);
  }, [goalAmount]);

  const stats = useMemo(() => {
    const now = new Date();
    const baseDate = selectedMonth
      ? new Date(Number(selectedMonth.split("-")[0]), Number(selectedMonth.split("-")[1]) - 1, 1)
      : now;
    const monthKey = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = baseDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

    const scopedExpenses =
      selectedCategory === "All"
        ? expenses
        : expenses.filter((expense) => expense.category === selectedCategory);
    const monthlySpent = scopedExpenses
      .filter((expense) => expense.date.startsWith(monthKey))
      .reduce((sum, expense) => sum + expense.amount, 0);

    const goal = Number(goalAmount) || 0;
    const progress = goal > 0 ? Math.min((monthlySpent / goal) * 100, 100) : 0;
    const delta = goal - monthlySpent;

    const monthStart = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    const monthEnd = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
    const totalDays = monthEnd.getDate();
    const isCurrentMonth = monthKey === now.toISOString().slice(0, 7);
    const elapsedDays = isCurrentMonth ? Math.max(1, now.getDate()) : totalDays;
    const remainingDays = Math.max(totalDays - elapsedDays, 0);

    const idealSpendByToday = goal > 0 ? (goal / totalDays) * elapsedDays : 0;
    const monthlyRunway = goal - monthlySpent;
    const recommendedDailySpend = remainingDays > 0 ? Math.max(monthlyRunway / remainingDays, 0) : 0;
    const paceDelta = monthlySpent - idealSpendByToday;

    return {
      monthLabel,
      monthlySpent,
      goal,
      progress,
      delta,
      remainingDays,
      monthlyRunway,
      recommendedDailySpend,
      paceDelta,
      isCurrentMonth
    };
  }, [expenses, goalAmount, selectedCategory, selectedMonth]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Savings Goals & Spending Plan</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Flag size={16} />
            Monthly Savings Goal
          </p>
          <Input
            type="number"
            min="0"
            step="1"
            value={goalAmount}
            onChange={(event) => setGoalAmount(event.target.value)}
          />
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Month: <span className="font-semibold">{stats.monthLabel}</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Spent: {formatCurrency(stats.monthlySpent)} • Goal: {formatCurrency(stats.goal)}
          </p>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              stats.delta >= 0
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
            }`}
          >
            {stats.delta >= 0
              ? `Ahead by ${formatCurrency(stats.delta)}`
              : `Behind by ${formatCurrency(Math.abs(stats.delta))}`}
          </span>
        </Card>

        <Card className="space-y-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <CalendarClock size={16} />
            Monthly Runway
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Remaining budget: <span className="font-semibold">{formatCurrency(stats.monthlyRunway)}</span>
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Days left this month: <span className="font-semibold">{stats.remainingDays}</span>
          </p>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              stats.monthlyRunway >= 0
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
            }`}
          >
            {stats.monthlyRunway >= 0
              ? "You are within your plan for this month"
              : `Overspent by ${formatCurrency(Math.abs(stats.monthlyRunway))} this month`}
          </span>

          {stats.isCurrentMonth ? (
            <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
              Suggested daily spend cap: {formatCurrency(stats.recommendedDailySpend)}
            </span>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
