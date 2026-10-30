"use client";

import { useState, useMemo } from "react";
import type { Finding } from "@/frontend/lib/types";
import { IssueCard } from "./IssueCard";
import { cn } from "@/frontend/lib/cn";

type SeverityFilter = "ALL" | "HIGH" | "MED" | "LOW";

interface IssueListProps {
    findings: Finding[];
    className?: string;
    onSelect?: (finding: Finding) => void;
}

const FILTER_LABELS: Record<SeverityFilter, string> = {
    ALL: "All",
    HIGH: "High",
    MED: "Med",
    LOW: "Low",
};

const FILTER_COLORS: Record<SeverityFilter, string> = {
    ALL: "#818cf8",
    HIGH: "#f87171",
    MED: "#fb923c",
    LOW: "#fbbf24",
};

export function IssueList({ findings, className, onSelect }: IssueListProps) {
    const [filter, setFilter] = useState<SeverityFilter>("ALL");

    const counts = useMemo(
        () => ({
            HIGH: findings.filter((f) => f.severity === "HIGH").length,
            MED: findings.filter((f) => f.severity === "MED").length,
            LOW: findings.filter((f) => f.severity === "LOW").length,
        }),
        [findings]
    );

    const visible = useMemo(
        () =>
            filter === "ALL"
                ? findings
                : findings.filter((f) => f.severity === filter),
        [findings, filter]
    );

    if (findings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
                <span className="text-4xl">✅</span>
                <p className="text-slate-400 text-sm">No issues found.</p>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {/* Filter tabs */}
            <div className="flex items-center gap-2 flex-wrap">
                {(Object.keys(FILTER_LABELS) as SeverityFilter[]).map((key) => {
                    const active = filter === key;
                    const count = key === "ALL" ? findings.length : counts[key];
                    return (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                active
                                    ? "text-white"
                                    : "text-slate-400 hover:text-slate-200"
                            )}
                            style={
                                active
                                    ? {
                                        background: `${FILTER_COLORS[key]}22`,
                                        border: `1px solid ${FILTER_COLORS[key]}66`,
                                        color: FILTER_COLORS[key],
                                    }
                                    : {
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                    }
                            }
                        >
                            {FILTER_LABELS[key]}
                            <span
                                className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                                style={{
                                    background: active
                                        ? `${FILTER_COLORS[key]}33`
                                        : "rgba(255,255,255,0.08)",
                                }}
                            >
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* List */}
            <div className="flex flex-col gap-2">
                {visible.map((finding) => (
                    <IssueCard
                        key={finding.id}
                        finding={finding}
                        onClick={() => onSelect?.(finding)}
                    />
                ))}
            </div>
        </div>
    );
}
