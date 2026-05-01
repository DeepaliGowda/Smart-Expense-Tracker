import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border border-indigo-500/70 bg-gradient-to-r from-indigo-600 via-blue-600 to-slate-700 text-white shadow-[0_16px_35px_-18px_rgba(37,99,235,0.65)] hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_22px_45px_-18px_rgba(30,64,175,0.75)] focus-visible:ring-indigo-500",
  secondary:
    "border border-slate-300/80 bg-white/85 text-slate-800 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:border-indigo-700 dark:hover:bg-slate-700",
  danger:
    "border border-rose-500/70 bg-gradient-to-r from-rose-600 to-red-500 text-white hover:-translate-y-0.5 hover:brightness-110 focus-visible:ring-rose-500",
  ghost:
    "border border-transparent bg-transparent text-slate-700 hover:-translate-y-0.5 hover:border-slate-200 hover:bg-white/75 focus-visible:ring-slate-400 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800/80"
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
