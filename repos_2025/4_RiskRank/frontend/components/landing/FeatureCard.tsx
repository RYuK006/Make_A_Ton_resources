"use client";

import { cn } from "@/frontend/lib/cn";
import { ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
    className?: string;
    /** Optional accent colour for the icon container (hex/rgba). */
    accentColor?: string;
}

export function FeatureCard({
    icon,
    title,
    description,
    className,
    accentColor = "#6366f1",
}: FeatureCardProps) {
    return (
        <div
            className={cn(
                "group flex flex-col gap-4 rounded-2xl p-6 transition-all duration-300",
                "hover:-translate-y-1",
                className
            )}
            style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 2px 24px rgba(0,0,0,0.3)",
            }}
        >
            {/* Icon */}
            <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl transition-transform duration-300 group-hover:scale-110"
                style={{
                    background: `${accentColor}22`,
                    border: `1px solid ${accentColor}44`,
                    color: accentColor,
                }}
            >
                {icon}
            </div>

            {/* Text */}
            <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

// ── FeaturesGrid ──────────────────────────────────────────────

const DEFAULT_FEATURES = [
    {
        icon: "🔍",
        title: "Deep Code Analysis",
        description:
            "Scans every file in your repository, detecting injection flaws, insecure dependencies, and logic bugs.",
        accentColor: "#6366f1",
    },
    {
        icon: "⚡",
        title: "Instant Results",
        description:
            "Get ranked findings with business impact assessments in seconds, not hours.",
        accentColor: "#38bdf8",
    },
    {
        icon: "🛡️",
        title: "Top Risk Ranking",
        description:
            "AI prioritises the vulnerabilities that matter most to your organisation.",
        accentColor: "#34d399",
    },
    {
        icon: "📋",
        title: "Clear Remediation",
        description:
            "Each issue comes with step-by-step fix guidance and example patches.",
        accentColor: "#f59e0b",
    },
    {
        icon: "📈",
        title: "Scan History",
        description:
            "Track security posture improvements over time with a full scan history and diff view.",
        accentColor: "#a78bfa",
    },
    {
        icon: "🔒",
        title: "Secure by Default",
        description:
            "Your code never leaves your environment — scans run server-side with your credentials.",
        accentColor: "#fb923c",
    },
];

interface FeaturesGridProps {
    className?: string;
}

export function FeaturesGrid({ className }: FeaturesGridProps) {
    return (
        <section className={cn("px-6 py-20", className)}>
            <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-2">
                    Everything you need to ship secure code
                </h2>
                <p className="text-center text-slate-400 text-sm mb-12">
                    Designed for developers who move fast but can&apos;t afford breaches.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {DEFAULT_FEATURES.map((f) => (
                        <FeatureCard key={f.title} {...f} />
                    ))}
                </div>
            </div>
        </section>
    );
}
