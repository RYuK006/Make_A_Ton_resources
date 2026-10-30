"use client";

import { cn } from "@/frontend/lib/cn";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
    icon?: ReactNode;
}

const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
    primary:
        "text-white shadow-lg hover:-translate-y-0.5",
    secondary:
        "text-slate-200 hover:text-white hover:-translate-y-0.5",
    danger:
        "text-white hover:-translate-y-0.5",
    ghost:
        "text-slate-400 hover:text-white hover:bg-white/5",
    outline:
        "text-slate-300 hover:text-white hover:-translate-y-0.5",
};

const sizes = {
    sm: "text-xs px-3 py-2",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-6 py-3",
};

const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
    },
    secondary: {
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
    },
    danger: {
        background: "linear-gradient(135deg, #ef4444, #f97316)",
        boxShadow: "0 4px 16px rgba(239,68,68,0.3)",
    },
    ghost: {},
    outline: {
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.15)",
    },
};

export function Button({
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    children,
    className,
    style,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(base, variants[variant], sizes[size], className)}
            style={{ ...variantStyles[variant], ...style }}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : icon ? (
                icon
            ) : null}
            {children}
        </button>
    );
}
