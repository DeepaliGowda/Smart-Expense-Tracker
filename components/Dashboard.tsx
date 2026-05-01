"use client";

import { useMemo } from "react";
import { BadgeIndianRupee, PieChartIcon, TrendingUp, Wallet } from "lucide-react";
import Card from "@/components/ui/Card";
import Skeleton from "@/components/ui/Skeleton";
import { formatCurrency } from "@/utils/format";
import { Expense } from "@/utils/storage";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type DashboardProps = {
  expenses: Expense[];
  isLoading: boolean;
  selectedMonth: string;
  monthlyIncome: number;
};

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

export default function Dashboard({
  expenses,
  isLoading,
  selectedMonth,
  monthlyIncome
}: DashboardProps) {
  const insights = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const currentMonth = selectedMonth || new Date().toISOString().slice(0, 7);
    const monthlyTotal = expenses
      .filter((expense) => expense.date.startsWith(currentMonth))
      .reduce((sum, expense) => sum + expense.amount, 0);

    const categoryMap = expenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] ?? 0) + expense.amount;
      return acc;
    }, {});

    const pieData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));
    const topCategory = [...pieData].sort((a, b) => b.value - a.value)[0];

    const savings = monthlyIncome - monthlyTotal;
    const savingsRate = monthlyIncome > 0 ? (savings / monthlyIncome) * 100 : 0;
    const burnRate = monthlyIncome > 0 ? (monthlyTotal / monthlyIncome) * 100 : 0;

    const now = new Date();
    const isCurrentMonth = currentMonth === now.toISOString().slice(0, 7);
    const dayCount = new Date(Number(currentMonth.split("-")[0]), Number(currentMonth.split("-")[1]), 0).getDate();
    const elapsedDays = isCurrentMonth ? Math.max(1, now.getDate()) : dayCount;
    // Early-month extrapolation (e.g. day 1) can wildly overstate burn.
    // Use actual balance until enough days have elapsed for a stable projection.
    const projectedSpend =
      isCurrentMonth && elapsedDays < 5
        ? monthlyTotal
        : elapsedDays > 0
          ? (monthlyTotal / elapsedDays) * dayCount
          : monthlyTotal;
    const projectedMonthEndBalance = monthlyIncome - projectedSpend;

    return {
      total,
      monthlyTotal,
      categoryMap,
      pieData,
      topCategory,
      savingsRate,
      burnRate,
      projectedMonthEndBalance
    };
  }, [expenses, selectedMonth, monthlyIncome]);

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
          {selectedMonth ? "Selected Month" : "This Month"}
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {formatCurrency(insights.monthlyTotal)}
        </p>
      </Card>
      <Card>
        <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <BadgeIndianRupee size={16} />
          Top Category
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {insights.topCategory?.name ?? "N/A"}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {insights.topCategory ? `${formatCurrency(insights.topCategory.value)} spent` : "No data yet"}
        </p>
      </Card>
      <Card>
        <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <TrendingUp size={16} />
          Savings Rate
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{insights.savingsRate.toFixed(1)}%</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">Burn rate: {insights.burnRate.toFixed(1)}%</p>
      </Card>
      <Card>
        <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Wallet size={16} />
          Projected Month-End Balance
        </p>
        <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {formatCurrency(insights.projectedMonthEndBalance)}
        </p>
      </Card>

      <Card className="lg:col-span-2">
        <h2 className="mb-4 inline-flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
          <PieChartIcon size={18} className="text-cyan-500" />
          Category-wise Spending
        </h2>
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
              className="inline-flex items-center justify-between gap-3 rounded-lg border border-slate-200/70 bg-slate-50/90 px-2.5 py-2 text-xs text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300 dark:hover:border-indigo-800"
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
