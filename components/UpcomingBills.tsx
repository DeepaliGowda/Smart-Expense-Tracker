"use client";

import { useMemo } from "react";
import { BellRing } from "lucide-react";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/utils/format";
import { Expense } from "@/utils/storage";

type UpcomingBillsProps = {
  expenses: Expense[];
  selectedMonth: string;
};

export default function UpcomingBills({ expenses, selectedMonth }: UpcomingBillsProps) {
  const dueItems = useMemo(() => {
    const now = new Date();
    const baseDate = selectedMonth
      ? new Date(Number(selectedMonth.split("-")[0]), Number(selectedMonth.split("-")[1]) - 1, 1)
      : now;
    const monthKey = `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, "0")}`;
    const todayDay = now.getDate();

    return expenses
      .filter(
        (expense) =>
          expense.isRecurring &&
          expense.recurrence === "monthly" &&
          expense.date.startsWith(monthKey) &&
          !expense.isPaid &&
          !expense.isIgnored
      )
      .map((expense) => {
        const dueDay = expense.dueDay ?? new Date(expense.date).getDate();
        const daysLeft = dueDay - todayDay;
        return { ...expense, dueDay, daysLeft };
      })
      .sort((a, b) => a.dueDay - b.dueDay)
      .slice(0, 6);
  }, [expenses, selectedMonth]);

  if (dueItems.length === 0) {
    return (
      <Card className="space-y-2">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <BellRing size={16} />
          Upcoming Bills
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Mark expenses as monthly recurring to track upcoming bills here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3">
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <BellRing size={16} />
        Upcoming Bills
      </p>
      <div className="space-y-2">
        {dueItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Due day {item.dueDay} • {item.daysLeft >= 0 ? `${item.daysLeft} day(s) left` : `${Math.abs(item.daysLeft)} day(s) overdue`}
              </p>
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(item.amount)}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
