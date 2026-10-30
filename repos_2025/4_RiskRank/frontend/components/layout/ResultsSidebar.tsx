"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw, Loader2 } from "lucide-react";
import { ScanSession } from "@/frontend/lib/types";
import { getCurrentScan, setCurrentScan } from "@/frontend/lib/store";

/* ─── helpers ─────────────────────────────────────────── */
function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/* ─── Single session entry ─────────────────────────────── */
function SessionEntry({
    session,
    isActive,
    onClick,
}: {
    session: ScanSession;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150"
            style={{
                background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                border: `1px solid ${isActive ? "rgba(99,102,241,0.3)" : "transparent"}`,
            }}
        >
            <p className="text-xs font-semibold" style={{ color: "#94a3b8" }}>
                {session.project}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                {formatDate(session.timestamp)}
            </p>
        </button>
    );
}

/* ─── Sidebar ───────────────────────────────────────────── */
export function ResultsSidebar() {
    const router = useRouter();
    const [sessions, setSessions] = useState<ScanSession[]>([]);
    const [activeScanId, setActiveScanId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const current = getCurrentScan();
        if (current) setActiveScanId(current.id);

        const projectName = current?.project ?? "";

        // Fetch all scans for this project name directly
        const url = projectName
            ? `/api/scans?projectName=${encodeURIComponent(projectName)}`
            : "/api/scans";

        fetch(url)
            .then((r) => r.json())
            .then((data) => {
                setSessions(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    async function loadSession(session: ScanSession) {
        try {
            const res = await fetch(`/api/scans/${session.id}`);
            if (res.ok) {
                const full = await res.json();
                setCurrentScan(full);
                setActiveScanId(session.id);
                router.refresh();
            }
        } catch { /* ignore */ }
    }

    return (
        <aside
            className="fixed left-0 top-14 bottom-0 z-30 flex flex-col overflow-hidden"
            style={{
                width: "256px",
                background: "rgba(9,10,18,0.97)",
                borderRight: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(16px)",
            }}
        >
            {/* ── Back button ──────────────────────────── */}
            <div className="px-3 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <button
                    onClick={() => router.push("/repos")}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all w-full"
                    style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#64748b",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#a78bfa";
                        e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#64748b";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                >
                    <ArrowLeft size={13} />
                    Repositories
                </button>
            </div>

            {/* ── Sessions list ─────────────────────────── */}
            <div
                className="flex-1 overflow-y-auto px-2 py-3"
                style={{ scrollbarWidth: "thin", scrollbarColor: "#1e293b transparent" }}
            >
                {loading ? (
                    <div className="flex items-center justify-center py-10" style={{ color: "#334155" }}>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        <span className="text-xs">Loading history…</span>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center py-10" style={{ color: "#334155" }}>
                        <RotateCcw size={22} className="mx-auto mb-2 opacity-40" />
                        <p className="text-xs">No history for this project</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {sessions.map((s) => (
                            <SessionEntry
                                key={s.id}
                                session={s}
                                isActive={s.id === activeScanId}
                                onClick={() => loadSession(s)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </aside>
    );
}
