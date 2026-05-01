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
        "group animate-rise-in relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-50/90 p-5 shadow-[0_24px_65px_-28px_rgba(15,23,42,0.55)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-30px_rgba(30,64,175,0.35)] dark:border-slate-700/80 dark:bg-slate-950 dark:backdrop-blur-none dark:shadow-[0_24px_65px_-28px_rgba(2,6,23,0.95)]",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(120deg,#0f172a_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-[0.09]" />
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-indigo-200/45 blur-2xl transition-opacity duration-300 group-hover:opacity-90 dark:hidden" />
      <div className="pointer-events-none absolute -bottom-16 left-8 h-28 w-28 rounded-full bg-slate-300/40 blur-2xl dark:hidden" />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
