import { ReactNode } from "react";
import { cn } from "@/utils/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <section
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_-22px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-24px_rgba(79,70,229,0.35)] dark:border-slate-800/90 dark:bg-slate-900/75 dark:shadow-[0_20px_50px_-22px_rgba(2,6,23,0.7)]",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-indigo-200/50 blur-2xl transition-opacity duration-300 group-hover:opacity-90 dark:bg-indigo-500/20" />
      <div className="pointer-events-none absolute -bottom-16 left-8 h-28 w-28 rounded-full bg-cyan-200/50 blur-2xl dark:bg-cyan-500/10" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
