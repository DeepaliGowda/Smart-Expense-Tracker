"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

type CategoryManagerProps = {
  categories: string[];
  expenseCategories: string[];
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
};

export default function CategoryManager({
  categories,
  expenseCategories,
  onAddCategory,
  onDeleteCategory
}: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("");

  const handleAdd = () => {
    const value = newCategory.trim();
    if (!value) return;
    if (categories.includes(value)) {
      toast.error("Category already exists");
      return;
    }

    onAddCategory(value);
    setNewCategory("");
    toast.success("Category added");
  };

  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Manage Categories</h2>
      <div className="flex flex-col gap-2 sm:flex-row mt-5">
        <Input
          placeholder="Enter new category"
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
        />
        <Button type="button" onClick={handleAdd}>
          <Plus size={14} />
          Add
        </Button>
      </div>
      <div className="mt-2 grid gap-2 border-t border-slate-200/80 pt-3 sm:grid-cols-2 dark:border-slate-700/80">
        {categories.map((category) => {
          const hasExpenses = expenseCategories.includes(category);

          return (
            <div
              key={category}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/85 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              <span>{category}</span>
              <Button
                type="button"
                variant="ghost"
                className="px-2 py-1 text-xs"
                onClick={() => {
                  if (hasExpenses) {
                    toast.error("Cannot delete category with existing expenses");
                    return;
                  }
                  onDeleteCategory(category);
                  toast.success("Category removed");
                }}
              >
                <Trash2 size={13} />
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
