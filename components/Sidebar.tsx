"use client";

import { ComponentType } from "react";
import {
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  PlusSquare,
  Settings
} from "lucide-react";
import { cn } from "@/utils/cn";

export type SidebarSection = "overview" | "transactions" | "add" | "categories" | "settings";

type SidebarProps = {
  activeSection: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
};

const items: Array<{ id: SidebarSection; label: string; icon: ComponentType<{ size?: number }> }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ListChecks },
  { id: "add", label: "Add Expense", icon: PlusSquare },
  { id: "categories", label: "Categories", icon: FolderKanban },
  { id: "settings", label: "Settings", icon: Settings }
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="sticky top-4 h-fit rounded-3xl border border-white/60 bg-white/75 p-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/75">
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
              )}
            >
              <Icon size={15} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
