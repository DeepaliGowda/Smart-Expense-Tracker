"use client";

import { Pencil, ReceiptText, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/utils/format";
import { Expense } from "@/utils/storage";

type ExpenseListProps = {
  expenses: Expense[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
  onDeleteRequest: (expense: Expense) => void;
};

export default function ExpenseList({ expenses, isLoading, onEdit, onDeleteRequest }: ExpenseListProps) {
  if (isLoading) {
    return (
      <Card className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </Card>
    );
  }

  if (expenses.length === 0) {
    return (
      <EmptyState
        icon={<ReceiptText size={22} />}
        title="No expenses to display"
        description="Try adjusting your filters or add a new expense to start building insights."
      />
    );
  }

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recent Transactions</h2>
        <span className="rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
          {expenses.length} items
        </span>
      </div>
      <ul className="space-y-3">
        {expenses.map((expense) => (
          <li
            key={expense.id}
            className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-gradient-to-r from-slate-50/95 via-slate-50/85 to-indigo-100/45 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_14px_35px_-14px_rgba(79,70,229,0.45)] dark:border-slate-700 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:hover:border-indigo-800 sm:flex-row sm:items-center"
          >
            <div>
              <p className="text-base font-semibold text-slate-900 transition-colors duration-300 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-300">
                {expense.title}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {expense.category} • {new Date(expense.date).toLocaleDateString()}
              </p>
              {expense.isRecurring && expense.recurrence === "monthly" ? (
                <span className="mt-1 inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                  Recurring monthly
                </span>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <p className="min-w-24 text-right text-base font-bold text-slate-900 transition-transform duration-300 group-hover:scale-105 dark:text-slate-100">
                {formatCurrency(expense.amount)}
              </p>
              <Button variant="secondary" className="px-3 py-2" onClick={() => onEdit(expense)}>
                <Pencil size={14} />
              </Button>
              <Button variant="danger" className="px-3 py-2" onClick={() => onDeleteRequest(expense)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
