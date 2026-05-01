"use client";

import { Filter, RefreshCcw } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

type FiltersProps = {
  categories: string[];
  selectedCategory: string;
  selectedMonth: string;
  onCategoryChange: (value: string) => void;
  onMonthChange: (value: string) => void;
  onReset: () => void;
};

export default function Filters({
  categories,
  selectedCategory,
  selectedMonth,
  onCategoryChange,
  onMonthChange,
  onReset
}: FiltersProps) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
          <Filter size={18} className="text-indigo-500" />
          Filters
        </h2>
        <Button variant="ghost" className="px-2.5 py-1.5 text-xs" onClick={onReset}>
          <RefreshCcw size={14} />
          Reset
        </Button>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <select
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white/70 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition-all duration-200 hover:border-indigo-300 hover:shadow-md focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-indigo-800 dark:focus:ring-indigo-900"
        >
          <option value="All" className="text-slate-900">
            All Categories
          </option>
          {categories.map((category) => (
            <option key={category} value={category} className="text-slate-900">
              {category}
            </option>
          ))}
        </select>
        <Input
          type="month"
          value={selectedMonth}
          onChange={(event) => onMonthChange(event.target.value)}
          className="hover:border-indigo-300 hover:shadow-md dark:hover:border-indigo-800"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-700/80">
        {["All", ...categories.slice(0, 5)].map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "border-indigo-500 bg-indigo-500 text-white shadow-sm shadow-indigo-500/40"
                  : "border-slate-300 bg-white/70 text-slate-600 hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:border-indigo-800 dark:hover:text-indigo-300"
              }`}
              type="button"
            >
              {category}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
