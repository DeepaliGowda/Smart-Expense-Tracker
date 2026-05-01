"use client";

import { useEffect, useMemo, useState } from "react";
import { Flag, Flame } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { formatCurrency } from "@/utils/format";
import { Expense } from "@/utils/storage";

type SavingsGoalsProps = {
  expenses: Expense[];
};

const GOAL_KEY = "smart-expense-savings-goal";
const CHALLENGE_KEY = "smart-expense-challenge-days";

export default function SavingsGoals({ expenses }: SavingsGoalsProps) {
  const [goalAmount, setGoalAmount] = useState("10000");
  const [challengeDays, setChallengeDays] = useState("7");

  useEffect(() => {
    const rawGoal = window.localStorage.getItem(GOAL_KEY);
    const rawChallenge = window.localStorage.getItem(CHALLENGE_KEY);
    if (rawGoal) setGoalAmount(rawGoal);
    if (rawChallenge) setChallengeDays(rawChallenge);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(GOAL_KEY, goalAmount);
  }, [goalAmount]);

  useEffect(() => {
    window.localStorage.setItem(CHALLENGE_KEY, challengeDays);
  }, [challengeDays]);

  const stats = useMemo(() => {
    const now = new Date();
    const monthKey = now.toISOString().slice(0, 7);
    const monthlySpent = expenses
      .filter((expense) => expense.date.startsWith(monthKey))
      .reduce((sum, expense) => sum + expense.amount, 0);

    const goal = Number(goalAmount) || 0;
    const challengeTarget = Number(challengeDays) || 0;
    const progress = goal > 0 ? Math.min((monthlySpent / goal) * 100, 100) : 0;
    const delta = goal - monthlySpent;

    const expenseDateSet = new Set(expenses.map((expense) => expense.date));
    let noSpendStreak = 0;
    const cursor = new Date();
    for (let i = 0; i < 60; i += 1) {
      const dateKey = cursor.toISOString().slice(0, 10);
      if (expenseDateSet.has(dateKey)) break;
      noSpendStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return {
      monthlySpent,
      goal,
      progress,
      delta,
      noSpendStreak,
      challengeTarget,
      challengeCompleted: challengeTarget > 0 && noSpendStreak >= challengeTarget
    };
  }, [expenses, goalAmount, challengeDays]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Savings Goals & Challenge Mode</h2>
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
            <Flame size={16} />
            No-Spend Challenge
          </p>
          <Input
            type="number"
            min="1"
            step="1"
            value={challengeDays}
            onChange={(event) => setChallengeDays(event.target.value)}
          />
          <p className="text-sm text-slate-600 dark:text-slate-300">Current streak: {stats.noSpendStreak} days</p>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
              stats.challengeCompleted
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
            }`}
          >
            {stats.challengeCompleted
              ? `Challenge completed (${stats.challengeTarget} days)!`
              : `Need ${Math.max(stats.challengeTarget - stats.noSpendStreak, 0)} more day(s)`}
          </span>
        </Card>
      </div>
    </div>
  );
}
