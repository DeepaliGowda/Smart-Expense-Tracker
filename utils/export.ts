import { Expense } from "@/utils/storage";

export const exportExpensesToCsv = (expenses: Expense[]) => {
  const headers = ["id", "title", "amount", "category", "date"];
  const rows = expenses.map((expense) => [
    expense.id,
    `"${expense.title.replaceAll("\"", "\"\"")}"`,
    expense.amount.toFixed(2),
    expense.category,
    expense.date
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
};
