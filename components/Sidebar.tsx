"use client";

import { ComponentType } from "react";
import {
  BadgeIndianRupee,
  FolderKanban,
  LayoutDashboard,
  ListChecks,
  PiggyBank,
  Settings
} from "lucide-react";
import { cn } from "@/utils/cn";

export type SidebarSection = "overview" | "transactions" | "add" | "income" | "categories" | "settings";

type SidebarProps = {
  activeSection: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
};

const items: Array<{ id: SidebarSection; label: string; icon: ComponentType<{ size?: number }> }> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "transactions", label: "Transactions", icon: ListChecks },
  { id: "add", label: "Add Expense", icon: BadgeIndianRupee },
  { id: "income", label: "Monthly Income", icon: PiggyBank },
  { id: "categories", label: "Categories", icon: FolderKanban },
  { id: "settings", label: "Settings", icon: Settings }
];

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="sticky top-4 h-fit animate-rise-in rounded-3xl border border-slate-200/80 bg-slate-50/85 p-3 shadow-[0_20px_50px_-30px_rgba(30,64,175,0.55)] backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950 dark:backdrop-blur-none dark:shadow-[0_20px_50px_-30px_rgba(2,6,23,0.95)]">
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
                  ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-slate-700 text-white shadow-lg shadow-indigo-500/30"
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
