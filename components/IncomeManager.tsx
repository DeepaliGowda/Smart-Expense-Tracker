"use client";

import { useEffect, useState } from "react";
import { PiggyBank } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { formatCurrency } from "@/utils/format";

type IncomeManagerProps = {
  selectedMonth: string;
  setSelectedMonth: (value: string) => void;
  savedIncomeAmount: string;
  onSaveIncome: (value: string) => void;
  allIncomes: Record<string, string>;
};

export default function IncomeManager({
  selectedMonth,
  setSelectedMonth,
  savedIncomeAmount,
  onSaveIncome,
  allIncomes
}: IncomeManagerProps) {
  const [draftIncome, setDraftIncome] = useState(savedIncomeAmount);

  useEffect(() => {
    setDraftIncome(savedIncomeAmount);
  }, [savedIncomeAmount, selectedMonth]);

  return (
    <Card className="space-y-4">
      <h2 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
        <PiggyBank size={18} className="text-indigo-500" />
        Monthly Income Planner
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 m-2">
        Set income month-wise to unlock savings rate, burn rate, and month-end projection.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input type="month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} />
        <Input
          type="text"
          placeholder="Monthly income (e.g. 3000000 or 30 lakh)"
          value={draftIncome}
          onChange={(event) => setDraftIncome(event.target.value)}
        />
      </div>
      <div className="m-2 flex justify-start">
        <Button type="button" onClick={() => onSaveIncome(draftIncome)}>
          Save
        </Button>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 m-2">
        Added income for {selectedMonth || new Date().toISOString().slice(0, 7)}:{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-200">
          {formatCurrency(Number(savedIncomeAmount) || 0)}
        </span>
      </p>

      <div className="m-2 space-y-2 border-t border-slate-200 pt-3 dark:border-slate-700">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">All Added Incomes</p>
        {Object.entries(allIncomes)
          .sort(([a], [b]) => (a < b ? 1 : -1))
          .map(([month, amount]) => (
            <div
              key={month}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              <span className="font-medium text-slate-700 dark:text-slate-300">{month}</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(Number(amount) || 0)}
              </span>
            </div>
          ))}
        {Object.keys(allIncomes).length === 0 ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">No incomes added yet.</p>
        ) : null}
      </div>
    </Card>
  );
}
