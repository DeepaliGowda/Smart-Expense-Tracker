"use client";

import { useMemo } from "react";
import { PieChartIcon, Target, TrendingUp, Wallet } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/format";
import { Expense } from "@/utils/storage";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type DashboardProps = {
  expenses: Expense[];
  isLoading: boolean;
  budgetLimit: string;
  onBudgetLimitChange: (value: string) => void;
};

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

export default function Dashboard({ expenses, isLoading, budgetLimit, onBudgetLimitChange }: DashboardProps) {
  const insights = useMemo(() => {
    const parsedBudgetLimit = Number(budgetLimit) || 0;
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyTotal = expenses
      .filter((expense) => expense.date.startsWith(currentMonth))
      .reduce((sum, expense) => sum + expense.amount, 0);

    const categoryMap = expenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
      return acc;
    }, {});

    const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    const topCategory = [...pieData].sort((a, b) => b.value - a.value)[0];
    const budgetProgress = parsedBudgetLimit > 0 ? Math.min((total / parsedBudgetLimit) * 100, 100) : 0;

    return {
      total,
      monthlyTotal,
      categoryMap,
      pieData,
      topCategory,
      budgetProgress
    };
  }, [expenses, budgetLimit]);

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-80 w-full lg:col-span-3" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Wallet size={16} />
          Total Expenses
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {formatCurrency(insights.total)}
        </p>
      </Card>
      <Card>
        <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <TrendingUp size={16} />
          This Month
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {formatCurrency(insights.monthlyTotal)}
        </p>
      </Card>
      <Card>
        <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <PieChartIcon size={16} />
          Top Category
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {insights.topCategory?.name ?? "N/A"}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {insights.topCategory ? `${formatCurrency(insights.topCategory.value)} spent` : "No data yet"}
        </p>
      </Card>

      <Card className="lg:col-span-1">
        <h3 className="mb-3 inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
          <Target size={16} />
          Budget Limit
        </h3>
        <Input
          type="number"
          min="0"
          step="0.01"
          value={budgetLimit}
          onChange={(event) => onBudgetLimitChange(event.target.value)}
        />
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${insights.budgetProgress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {insights.budgetProgress.toFixed(0)}% of budget used
        </p>
      </Card>

      <Card className="lg:col-span-2">
        <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Category-wise Spending</h2>
        {insights.pieData.length === 0 ? (
          <p className="text-sm text-slate-500">Add expenses to view chart.</p>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={insights.pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  strokeWidth={2}
                  stroke="#ffffff"
                  label
                >
                  {insights.pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => {
                    const numericValue = typeof value === "number" ? value : Number(value ?? 0);
                    return formatCurrency(numericValue);
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {insights.pieData.map((item, index) => (
            <p
              key={item.name}
              className="inline-flex items-center justify-between gap-3 rounded-lg border border-slate-200/70 bg-white/60 px-2.5 py-2 text-xs text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-indigo-800"
            >
              <span className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
                {item.name}
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {formatCurrency(item.value)}
              </span>
            </p>
          ))}
        </div>
      </Card>
    </div>
  );
}
