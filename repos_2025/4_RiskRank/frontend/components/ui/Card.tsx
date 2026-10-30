"use client";

import { cn } from "@/frontend/lib/cn";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    glow?: boolean;
}

export function Card({ hover, glow, className, style, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "rounded-2xl transition-all duration-200",
                hover && "cursor-pointer hover:-translate-y-0.5",
                glow && "glow-accent",
                className
            )}
            style={{
                background: "rgba(15, 16, 24, 0.85)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
                ...(hover
                    ? {
                        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                    }
                    : {}),
                ...style,
            }}
            onMouseEnter={
                hover
                    ? (e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(99,102,241,0.25)";
                        (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.06)";
                    }
                    : undefined
            }
            onMouseLeave={
                hover
                    ? (e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                        (e.currentTarget as HTMLElement).style.boxShadow =
                            "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)";
                    }
                    : undefined
            }
            {...props}
        >
            {children}
        </div>
    );
}
