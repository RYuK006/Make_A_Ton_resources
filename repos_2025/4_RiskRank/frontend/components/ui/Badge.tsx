import { cn } from "@/frontend/lib/cn";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "danger" | "warning" | "success" | "info" | "outline";
    size?: "sm" | "md";
    className?: string;
}

const variantStyles: Record<string, string> = {
    default: "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25",
    danger: "bg-red-500/15 text-red-300 border border-red-500/25",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/25",
    success: "bg-green-500/15 text-green-300 border border-green-500/25",
    info: "bg-sky-500/15 text-sky-300 border border-sky-500/25",
    outline: "bg-transparent text-slate-400 border border-white/10",
};

export function Badge({
    children,
    variant = "default",
    size = "sm",
    className,
}: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full font-medium",
                size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
                variantStyles[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
