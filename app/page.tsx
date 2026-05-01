"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Moon, PiggyBank, ShieldCheck, Sparkles, Sun } from "lucide-react";
import toast from "react-hot-toast";
import CategoryManager from "@/components/CategoryManager";
import Dashboard from "@/components/Dashboard";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import Filters from "@/components/Filters";
import MonthlyMoneyStory from "@/components/MonthlyMoneyStory";
import SavingsGoals from "@/components/SavingsGoals";
import Sidebar, { SidebarSection } from "@/components/Sidebar";
import SmartInsights from "@/components/SmartInsights";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useExpenses } from "@/hooks/useExpenses";
import { useFilters } from "@/hooks/useFilters";
import { useTheme } from "@/hooks/useTheme";
import { exportExpensesToCsv } from "@/utils/export";
import { Expense } from "@/utils/storage";

const DEFAULT_CATEGORIES = ["Food", "Transport", "Shopping", "Bills", "Health", "Other"];

export default function Home() {
  const { expenses, isLoading, saveExpense, deleteExpense, editingExpense, setEditingExpense } = useExpenses();
  const {
    selectedCategory: overviewCategory,
    selectedMonth: overviewMonth,
    setSelectedCategory: setOverviewCategory,
    setSelectedMonth: setOverviewMonth,
    filteredExpenses: overviewFilteredExpenses
  } = useFilters(expenses);
  const {
    selectedCategory: transactionCategory,
    selectedMonth: transactionMonth,
    setSelectedCategory: setTransactionCategory,
    setSelectedMonth: setTransactionMonth,
    filteredExpenses: transactionFilteredExpenses
  } = useFilters(expenses);
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SidebarSection>("overview");
  const [budgetLimit, setBudgetLimit] = useState("5000");
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    const rawBudget = window.localStorage.getItem("smart-expense-budget");
    if (!rawBudget) return;

    try {
      const parsedBudget = JSON.parse(rawBudget) as string | number;
      setBudgetLimit(String(parsedBudget));
    } catch {
      setBudgetLimit("5000");
    }
  }, []);

  useEffect(() => {
    const rawCategories = window.localStorage.getItem("smart-expense-categories");
    if (!rawCategories) return;

    try {
      const parsedCategories = JSON.parse(rawCategories) as string[];
      if (Array.isArray(parsedCategories) && parsedCategories.length > 0) {
        setCategories(parsedCategories);
      }
    } catch {
      setCategories(DEFAULT_CATEGORIES);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("smart-expense-budget", JSON.stringify(budgetLimit));
  }, [budgetLimit]);

  useEffect(() => {
    window.localStorage.setItem("smart-expense-categories", JSON.stringify(categories));
  }, [categories]);

  const expenseCategories = useMemo(
    () => Array.from(new Set(expenses.map((expense) => expense.category))),
    [expenses]
  );
  const availableCategories = useMemo(
    () => Array.from(new Set([...categories, ...expenseCategories])).sort(),
    [categories, expenseCategories]
  );

  const handleSaveExpense = useCallback(
    (expense: Expense) => {
      saveExpense(expense, Boolean(editingExpense));
    },
    [saveExpense, editingExpense]
  );

  const handleResetOverviewFilters = useCallback(() => {
    setOverviewCategory("All");
    setOverviewMonth("");
  }, [setOverviewCategory, setOverviewMonth]);

  const handleResetTransactionFilters = useCallback(() => {
    setTransactionCategory("All");
    setTransactionMonth("");
  }, [setTransactionCategory, setTransactionMonth]);

  const handleConfirmDelete = useCallback(() => {
    if (!expenseToDelete) return;
    deleteExpense(expenseToDelete.id);
    setExpenseToDelete(null);
  }, [expenseToDelete, deleteExpense]);

  const handleExportCsv = useCallback(() => {
    const exportSource =
      activeSection === "transactions" ? transactionFilteredExpenses : overviewFilteredExpenses;
    exportExpensesToCsv(exportSource);
  }, [activeSection, overviewFilteredExpenses, transactionFilteredExpenses]);

  const handleEditExpense = useCallback(
    (expense: Expense) => {
      setEditingExpense(expense);

      // From Transactions view, jump to form so edit action feels immediate.
      if (activeSection === "transactions") {
        setActiveSection("add");
      }
    },
    [activeSection, setEditingExpense]
  );

  const addCategory = useCallback((category: string) => {
    setCategories((prev) => Array.from(new Set([...prev, category])));
  }, []);

  const removeCategory = useCallback((category: string) => {
    setCategories((prev) => prev.filter((item) => item !== category));
  }, []);

  const overviewPreviewExpenses = useMemo(
    () => overviewFilteredExpenses.slice(0, 5),
    [overviewFilteredExpenses]
  );

  const renderMainSection = () => {
    if (activeSection === "transactions") {
      return (
        <>
          <Filters
            categories={availableCategories}
            selectedCategory={transactionCategory}
            selectedMonth={transactionMonth}
            onCategoryChange={setTransactionCategory}
            onMonthChange={setTransactionMonth}
            onReset={handleResetTransactionFilters}
          />
          <ExpenseList
            expenses={transactionFilteredExpenses}
            isLoading={isLoading}
            onEdit={handleEditExpense}
            onDeleteRequest={setExpenseToDelete}
          />
        </>
      );
    }

    if (activeSection === "add") {
      return (
        <ExpenseForm
          onSave={handleSaveExpense}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
          categories={availableCategories}
        />
      );
    }

    if (activeSection === "categories") {
      return (
        <CategoryManager
          categories={availableCategories}
          expenseCategories={expenseCategories}
          onAddCategory={addCategory}
          onDeleteCategory={removeCategory}
        />
      );
    }

    if (activeSection === "settings") {
      return (
        <Card className="space-y-3">
          <h2 className="text-xl font-semibold">Settings</h2>
          <p className="m-2 text-sm text-slate-500 dark:text-slate-400">
            Currency is set to INR for this app. You can also export data as CSV.
          </p>
          <Button
            variant="danger"
            onClick={() => {
              window.localStorage.clear();
              toast.success("Local data cleared. Refresh to re-initialize.");
            }}
          >
            Clear Local Data
          </Button>
        </Card>
      );
    }

    return (
      <>
        <Filters
          categories={availableCategories}
          selectedCategory={overviewCategory}
          selectedMonth={overviewMonth}
          onCategoryChange={setOverviewCategory}
          onMonthChange={setOverviewMonth}
          onReset={handleResetOverviewFilters}
        />
        <Dashboard
          expenses={overviewFilteredExpenses}
          isLoading={isLoading}
          budgetLimit={budgetLimit}
          onBudgetLimitChange={setBudgetLimit}
        />
        <MonthlyMoneyStory
          expenses={expenses}
          selectedMonth={overviewMonth}
          selectedCategory={overviewCategory}
        />
        <SmartInsights expenses={overviewFilteredExpenses} />
        <SavingsGoals expenses={expenses} />
        <ExpenseForm
          onSave={handleSaveExpense}
          editingExpense={editingExpense}
          onCancelEdit={() => setEditingExpense(null)}
          categories={availableCategories}
        />
        <ExpenseList
          expenses={overviewPreviewExpenses}
          isLoading={isLoading}
          onEdit={handleEditExpense}
          onDeleteRequest={setExpenseToDelete}
        />
        {!isLoading && overviewFilteredExpenses.length > 5 ? (
          <div className="flex justify-center">
            <Button variant="secondary" onClick={() => setActiveSection("transactions")}>
              View More Transactions
            </Button>
          </div>
        ) : null}
      </>
    );
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 app-grid-bg opacity-60 dark:opacity-40" />
      <div className="pointer-events-none absolute inset-0">
        <div className="finance-orb -left-24 -top-24 h-80 w-80 bg-indigo-300/35 dark:bg-indigo-500/10" />
        <div
          className="finance-orb right-0 top-16 h-72 w-72 bg-sky-300/35 dark:bg-sky-500/10"
          style={{ animationDelay: "1.8s" }}
        />
        <div
          className="finance-orb bottom-0 left-1/3 h-64 w-64 bg-indigo-300/30 dark:bg-indigo-500/10"
          style={{ animationDelay: "3.5s" }}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl space-y-6 px-4 py-8 md:px-6">
        <header className="animate-rise-in rounded-3xl border border-slate-200/80 bg-slate-50/85 p-5 shadow-[0_30px_80px_-34px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950 dark:backdrop-blur-none dark:shadow-[0_30px_80px_-34px_rgba(2,6,23,0.9)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-100/70 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-200">
                <Sparkles size={14} />
                Finance Intelligence Dashboard
              </p>
              <h1 className="bg-gradient-to-r from-indigo-600 via-blue-600 to-slate-700 bg-clip-text text-3xl font-black tracking-tight text-transparent md:text-5xl">
                Smart Expense Tracker
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Keep spending under control with live analytics, focused goals, and an elegant command center.
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                  <PiggyBank size={13} className="text-indigo-500" />
                  Expense Planning
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-800">
                  <ShieldCheck size={13} className="text-indigo-500" />
                  Secure Local Data
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={handleExportCsv}
                disabled={
                  (activeSection === "transactions" ? transactionFilteredExpenses : overviewFilteredExpenses)
                    .length === 0
                }
              >
                <Download size={15} />
                Export CSV
              </Button>
              <Button variant="ghost" onClick={toggleTheme}>
                {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
                {theme === "light" ? "Dark" : "Light"}
              </Button>
            </div>
          </div>
        </header>

        <div className="grid animate-rise-in gap-5 lg:grid-cols-[260px,1fr]">
          <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
          <section className="space-y-5">{renderMainSection()}</section>
        </div>

        <footer className="animate-rise-in flex items-center justify-center text-center text-xs text-slate-500 dark:text-slate-400">
          Built for intentional spending and smarter monthly decisions.
        </footer>
        <ConfirmModal
          open={Boolean(expenseToDelete)}
          title="Delete this expense?"
          description="This action cannot be undone. The selected transaction will be removed from local storage."
          onCancel={() => setExpenseToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </main>
  );
}
