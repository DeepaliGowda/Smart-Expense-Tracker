import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-[0_10px_25px_-12px_rgba(79,70,229,0.85)] hover:-translate-y-0.5 hover:from-indigo-500 hover:to-cyan-500 hover:shadow-[0_16px_30px_-14px_rgba(79,70,229,0.9)] focus-visible:ring-indigo-500 dark:from-indigo-500 dark:to-indigo-400 dark:hover:to-cyan-400",
  secondary:
    "bg-slate-200/85 text-slate-800 hover:-translate-y-0.5 hover:bg-slate-300 focus-visible:ring-slate-400 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
  danger:
    "bg-gradient-to-r from-rose-600 to-rose-500 text-white hover:-translate-y-0.5 hover:from-rose-500 hover:to-red-500 focus-visible:ring-rose-500",
  ghost:
    "bg-transparent text-slate-700 hover:-translate-y-0.5 hover:bg-slate-100 focus-visible:ring-slate-400 dark:text-slate-200 dark:hover:bg-slate-800"
};

export default function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-60",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
