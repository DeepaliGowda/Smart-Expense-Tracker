"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, FolderKanban, IndianRupee, NotebookText } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { Expense } from "@/utils/storage";

type ExpenseFormProps = {
  onSave: (expense: Expense) => void;
  editingExpense: Expense | null;
  onCancelEdit: () => void;
  categories: string[];
};

type FormState = {
  title: string;
  amount: string;
  category: string;
  date: string;
};

const defaultState: FormState = {
  title: "",
  amount: "",
  category: "Food",
  date: ""
};

export default function ExpenseForm({
  onSave,
  editingExpense,
  onCancelEdit,
  categories
}: ExpenseFormProps) {
  const [formState, setFormState] = useState<FormState>(defaultState);
  const isEditing = useMemo(() => Boolean(editingExpense), [editingExpense]);

  useEffect(() => {
    if (editingExpense) return;
    if (!categories.includes(formState.category)) {
      setFormState((prev) => ({ ...prev, category: categories[0] ?? "Other" }));
    }
  }, [categories, editingExpense, formState.category]);

  useEffect(() => {
    if (!editingExpense) {
      setFormState(defaultState);
      return;
    }

    setFormState({
      title: editingExpense.title,
      amount: String(editingExpense.amount),
      category: editingExpense.category,
      date: editingExpense.date
    });
  }, [editingExpense]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedAmount = Number(formState.amount);
    if (!formState.title.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0 || !formState.date) {
      return;
    }

    onSave({
      id: editingExpense?.id ?? crypto.randomUUID(),
      title: formState.title.trim(),
      amount: parsedAmount,
      category: formState.category,
      date: formState.date
    });

    setFormState(defaultState);
  };

  return (
    <Card className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {isEditing ? "Edit Expense" : "Add New Expense"}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Track every payment to keep your monthly budget under control.
        </p>
      </div>
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2 mt-5">
        <div className="group relative">
          <NotebookText
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-hover:text-indigo-500"
          />
          <Input
            type="text"
            placeholder="Title"
            value={formState.title}
            onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
            className="pl-9 hover:border-indigo-300 hover:shadow-md dark:hover:border-indigo-800"
            required
          />
        </div>
        <div className="group relative">
          <IndianRupee
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-hover:text-indigo-500"
          />
          <Input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={formState.amount}
            onChange={(event) => setFormState((prev) => ({ ...prev, amount: event.target.value }))}
            className="pl-9 hover:border-indigo-300 hover:shadow-md dark:hover:border-indigo-800"
            required
          />
        </div>
        <div className="group relative">
          <FolderKanban
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-hover:text-indigo-500"
          />
          <select
            value={formState.category}
            onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
            className="w-full rounded-xl border border-slate-300/90 bg-slate-50/90 py-2.5 pl-9 pr-3.5 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 hover:border-indigo-300 hover:shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-indigo-800 dark:focus:ring-indigo-900"
          >
            {categories.map((category) => (
              <option key={category} value={category} className="text-slate-900">
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="group relative">
          <Calendar
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-hover:text-indigo-500"
          />
          <Input
            type="date"
            value={formState.date}
            onChange={(event) => setFormState((prev) => ({ ...prev, date: event.target.value }))}
            className="pl-9 hover:border-indigo-300 hover:shadow-md dark:hover:border-indigo-800"
            required
          />
        </div>
        <div className="flex gap-2 md:col-span-2">
          <Button type="submit">{isEditing ? "Update Expense" : "Add Expense"}</Button>
          {isEditing && (
            <Button type="button" onClick={onCancelEdit} variant="secondary">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
