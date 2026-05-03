import { ReactNode } from "react";
import Card from "@/components/ui/Card";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <Card className="py-10">
      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-300">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </Card>
  );
}
