"use client";

import { cn } from "@/frontend/lib/cn";
import type { Finding, TopRisk } from "@/frontend/lib/types";

// ── Severity badge ────────────────────────────────────────────

const SEVERITY_COLORS = {
    HIGH: { bg: "rgba(239,68,68,0.15)", border: "rgba(239,68,68,0.5)", text: "#f87171" },
    MED: { bg: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.5)", text: "#fb923c" },
    LOW: { bg: "rgba(250,204,21,0.15)", border: "rgba(250,204,21,0.5)", text: "#fbbf24" },
};

function SeverityBadge({ severity }: { severity: Finding["severity"] }) {
    const c = SEVERITY_COLORS[severity];
    return (
        <span
            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide"
            style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                color: c.text,
            }}
        >
            {severity}
        </span>
    );
}

// ── IssueCard ─────────────────────────────────────────────────

interface IssueCardProps {
    finding: Finding;
    className?: string;
    onClick?: () => void;
}

export function IssueCard({ finding, className, onClick }: IssueCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left rounded-xl p-4 transition-all duration-200",
                "hover:scale-[1.01] cursor-pointer",
                className
            )}
            style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
            }}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-100 truncate">
                        {finding.message}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 font-mono">
                        {finding.file}
                        {finding.line > 0 && (
                            <span className="text-slate-600"> :{finding.line}</span>
                        )}
                    </p>
                </div>
                <SeverityBadge severity={finding.severity} />
            </div>
        </button>
    );
}

// ── TopRiskCard ───────────────────────────────────────────────

const CONFIDENCE_COLORS = {
    High: "#34d399",
    Medium: "#fbbf24",
    Low: "#94a3b8",
};

interface TopRiskCardProps {
    risk: TopRisk;
    className?: string;
}

export function TopRiskCard({ risk, className }: TopRiskCardProps) {
    return (
        <div
            className={cn("rounded-xl p-4 space-y-2", className)}
            style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
            }}
        >
            <div className="flex items-center gap-2">
                <span
                    className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                        background: "rgba(99,102,241,0.2)",
                        color: "#818cf8",
                        border: "1px solid rgba(99,102,241,0.4)",
                    }}
                >
                    {risk.rank}
                </span>
                <h3 className="text-sm font-semibold text-slate-100 flex-1 truncate">
                    {risk.title}
                </h3>
                <span
                    className="text-xs font-medium"
                    style={{ color: CONFIDENCE_COLORS[risk.confidence] }}
                >
                    {risk.confidence}
                </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{risk.reason}</p>
            {risk.remediation && (
                <p className="text-xs text-slate-500 leading-relaxed">
                    <span className="text-emerald-400 font-semibold">Fix: </span>
                    {risk.remediation}
                </p>
            )}
        </div>
    );
}
