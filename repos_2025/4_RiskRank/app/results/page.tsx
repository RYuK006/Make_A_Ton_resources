"use client";

import { useEffect, useState } from "react";
import { ScanResult, TopRisk, Finding, Severity } from "@/frontend/lib/types";
import { getCurrentScan, setCurrentScan } from "@/frontend/lib/store";
import { useSearchParams } from "next/navigation";
import {
    AlertTriangle,
    ShieldAlert,
    ShieldCheck,
    Info,
    ChevronDown,
    ChevronUp,
    Search,
    Folder,
    FileCode2,
    MapPin,
    Target,
    Zap,
} from "lucide-react";

/* ─── helpers ───────────────────────────────────────────── */
const SEV_CONFIG: Record<Severity, { label: string; color: string; bg: string; border: string; glow: string }> = {
    HIGH: { label: "HIGH", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)", glow: "rgba(239,68,68,0.15)" },
    MED: { label: "MED", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", glow: "rgba(245,158,11,0.15)" },
    LOW: { label: "LOW", color: "#6366f1", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.25)", glow: "rgba(99,102,241,0.15)" },
};

const CONF_CONFIG: Record<"High" | "Medium" | "Low", { color: string; dot: string }> = {
    High: { color: "#ef4444", dot: "#ef4444" },     // Red
    Medium: { color: "#eab308", dot: "#eab308" },   // Yellow
    Low: { color: "#3b82f6", dot: "#3b82f6" },      // Blue
};

function SevBadge({ sev }: { sev: Severity }) {
    const c = SEV_CONFIG[sev];
    return (
        <span
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold tracking-wider"
            style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color }}
        >
            {c.label}
        </span>
    );
}

/* ─── Top Risk Card ─────────────────────────────────────── */
function RiskCard({ risk }: { risk: TopRisk }) {
    const [open, setOpen] = useState(true);
    const cc = CONF_CONFIG[risk.confidence] || { color: "#6366f1", dot: "#6366f1" };
    const rc = cc.color;

    return (
        <div
            className="rounded-2xl overflow-hidden mb-6 transition-all duration-300"
            style={{
                background: "rgba(15,16,28,0.95)",
                border: `1px solid ${rc}30`,
                boxShadow: `0 0 32px ${rc}12, 0 2px 0 ${rc}40`,
            }}
        >
            {/* Card header */}
            <div
                className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
                style={{ background: `linear-gradient(90deg, ${rc}12 0%, transparent 60%)`, borderBottom: `1px solid ${rc}22` }}
                onClick={() => setOpen((o) => !o)}
            >
                <div className="flex items-center gap-4">
                    <div
                        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
                        style={{ background: `${rc}22`, border: `1.5px solid ${rc}50`, color: rc }}
                    >
                        #{risk.rank}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-mono font-bold text-white tracking-wide text-sm">{risk.title}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1" style={{ color: "#64748b" }}>
                                <MapPin size={10} />
                                {risk.location}
                            </span>
                            <span className="flex items-center gap-1.5" style={{ color: cc.color }}>
                                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: cc.dot }} />
                                {risk.confidence} Confidence
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{ color: "#475569" }}>
                    {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </div>

            {/* Card body */}
            {open && (
                <div className="px-6 py-5 grid grid-cols-1 gap-5">
                    {/* Three columns: Reason / Impact / Remediation */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { icon: <Info size={12} />, label: "REASON", text: risk.reason, col: "#6366f1" },
                            { icon: <AlertTriangle size={12} />, label: "BUSINESS IMPACT", text: risk.businessImpact, col: "#f59e0b" },
                            { icon: <ShieldCheck size={12} />, label: "REMEDIATION", text: risk.remediation, col: "#22c55e" },
                        ].map(({ icon, label, text, col }) => (
                            <div key={label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold tracking-widest" style={{ color: col }}>
                                    {icon} {label}
                                </div>
                                <p className="text-xs leading-relaxed" style={{ color: "#94a3b8" }}>{text}</p>
                            </div>
                        ))}
                    </div>

                    {/* Vulnerable code block */}
                    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                        <div className="flex items-center justify-between px-4 py-2" style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <span className="text-xs font-semibold tracking-widest" style={{ color: "#64748b" }}>VULNERABLE CODE</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ef4444" }} />
                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f59e0b" }} />
                                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#22c55e" }} />
                            </div>
                        </div>
                        <pre
                            className="text-xs font-mono p-4 overflow-x-auto whitespace-pre-wrap break-all"
                            style={{ background: "rgba(0,0,0,0.4)", color: "#fb923c", lineHeight: 1.7 }}
                        >
                            {risk.vulnerableCode}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Findings Table ────────────────────────────────────── */
function FindingsTable({ findings }: { findings: Finding[] }) {
    const [filter, setFilter] = useState<Severity | "ALL">("ALL");
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState<number | null>(null);

    const visible = findings.filter(
        (f) =>
            (filter === "ALL" || f.severity === filter) &&
            (f.file.toLowerCase().includes(search.toLowerCase()) ||
                f.message.toLowerCase().includes(search.toLowerCase()))
    );

    const counts = {
        ALL: findings.length,
        HIGH: findings.filter((f) => f.severity === "HIGH").length,
        MED: findings.filter((f) => f.severity === "MED").length,
        LOW: findings.filter((f) => f.severity === "LOW").length,
    };

    const filters: { key: Severity | "ALL"; label: string; color: string }[] = [
        { key: "ALL", label: `All (${counts.ALL})`, color: "#94a3b8" },
        { key: "HIGH", label: `High (${counts.HIGH})`, color: "#ef4444" },
        { key: "MED", label: `Med (${counts.MED})`, color: "#f59e0b" },
        { key: "LOW", label: `Low (${counts.LOW})`, color: "#6366f1" },
    ];

    return (
        <div>
            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="flex gap-2">
                    {filters.map(({ key, label, color }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{
                                background: filter === key ? `${color}18` : "rgba(255,255,255,0.04)",
                                border: `1px solid ${filter === key ? color + "50" : "rgba(255,255,255,0.08)"}`,
                                color: filter === key ? color : "#64748b",
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg flex-1 max-w-xs"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                    <Search size={12} style={{ color: "#475569" }} />
                    <input
                        type="text"
                        placeholder="Search file or message…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent text-xs outline-none flex-1"
                        style={{ color: "#94a3b8" }}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                {/* Header */}
                <div
                    className="grid text-xs font-semibold tracking-widest px-4 py-3"
                    style={{
                        background: "rgba(255,255,255,0.03)",
                        borderBottom: "1px solid rgba(255,255,255,0.07)",
                        color: "#475569",
                        gridTemplateColumns: "2.5rem 5rem 13rem 3.5rem 1fr",
                        gap: "1rem",
                    }}
                >
                    <span>#</span>
                    <span>SEVERITY</span>
                    <span>FILE</span>
                    <span>LINE</span>
                    <span>MESSAGE</span>
                </div>

                {/* Rows */}
                {visible.length === 0 && (
                    <div className="text-center py-16" style={{ color: "#475569" }}>
                        <ShieldCheck size={28} className="mx-auto mb-3 opacity-40" />
                        <p className="text-sm">No findings match your filter</p>
                    </div>
                )}

                {visible.map((f) => {
                    const sc = SEV_CONFIG[f.severity];
                    const isOpen = expanded === f.id;
                    return (
                        <div
                            key={f.id}
                            className="cursor-pointer transition-all duration-150"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                            onClick={() => setExpanded(isOpen ? null : f.id)}
                        >
                            <div
                                className="grid items-start px-4 py-3 text-xs"
                                style={{
                                    gridTemplateColumns: "2.5rem 5rem 13rem 3.5rem 1fr",
                                    gap: "1rem",
                                    background: isOpen ? sc.glow : "transparent",
                                }}
                            >
                                <span style={{ color: "#64748b", fontFamily: "monospace", paddingTop: 2 }}>{f.id}</span>
                                <span style={{ paddingTop: 1 }}>
                                    <SevBadge sev={f.severity} />
                                </span>
                                <span
                                    className="font-mono truncate block"
                                    style={{ color: "#7dd3fc", paddingTop: 2 }}
                                    title={f.file}
                                >
                                    {f.file}
                                </span>
                                <span style={{ color: "#64748b", fontFamily: "monospace", paddingTop: 2 }}>{f.line}</span>
                                <span style={{ color: isOpen ? "#e2e8f0" : "#94a3b8", lineHeight: 1.5 }}>
                                    {isOpen ? f.message : f.message.length > 120 ? f.message.slice(0, 120) + "…" : f.message}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ─── Summary stat pill ─────────────────────────────────── */
function StatPill({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
    return (
        <div
            className="flex items-center gap-3 px-5 py-4 rounded-2xl"
            style={{ background: `${color}08` }}
        >
            <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, color }}>
                {icon}
            </div>
            <div>
                <div className="text-2xl font-black" style={{ color, lineHeight: 1 }}>{value}</div>
                <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>{label}</div>
            </div>
        </div>
    );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function ResultsPage() {
    const [scan, setScan] = useState<ScanResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const searchParams = useSearchParams();

    useEffect(() => {
        const fetchScan = async () => {
            try {
                // 1. Try URL parameter first
                const idFromUrl = searchParams.get("id");

                // 2. Fallback to latest scan in store (just completed)
                const currentStoreScan = getCurrentScan();
                const targetId = idFromUrl || currentStoreScan?.id;

                if (!targetId) {
                    setError("No scan found. Please initiate a scan from the dashboard.");
                    setLoading(false);
                    return;
                }

                // If we have the full object right now in store, use it immediately
                if (currentStoreScan && currentStoreScan.id === targetId && currentStoreScan.findings) {
                    setScan(currentStoreScan);
                    setLoading(false);
                    return;
                }

                // Otherwise fetch it
                const res = await fetch(`/api/scan/${targetId}`);
                if (!res.ok) throw new Error("Failed to load scan data");

                const data = await res.json();

                // Polyfill for schema differences if old scans lack topRisks
                if (!data.topRisks) data.topRisks = [];
                if (!data.findings) data.findings = [];

                setScan(data);
                setCurrentScan(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchScan();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4" style={{ color: "#475569" }}>
                    <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                    <p className="text-sm">Loading actual scan data…</p>
                </div>
            </div>
        );
    }

    if (error || !scan) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <AlertTriangle size={48} color="#ef4444" className="mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Analysis Not Found</h1>
                <p style={{ color: "#94a3b8" }} className="mb-6 text-center max-w-md">
                    {error || "We couldn't find the scan results you were looking for."}
                </p>
                <a href="/repos" className="px-6 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
                    Back to Dashboard
                </a>
            </div>
        );
    }

    const highCount = scan.topRisks.filter(r => r.confidence === "High").length;
    const medCount = scan.topRisks.filter(r => r.confidence === "Medium").length;
    const lowCount = scan.topRisks.filter(r => r.confidence === "Low").length;
    const totalFindings = scan.topRisks.length;

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">

            {/* ── Project header ─────────────────────────── */}
            <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1" style={{ color: "#64748b" }}>
                        <Folder size={13} />
                        <span className="text-xs font-mono tracking-widest uppercase">Project</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">{scan.project}</h1>
                    <p className="text-sm mt-1" style={{ color: "#475569" }}>
                        Scanned {new Date(scan.timestamp).toLocaleString()} · SAST Prioritization Engine v1.0.0
                    </p>
                </div>
            </div>

            {/* ── Stats row ──────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                <StatPill icon={<Target size={16} />} label="Total Findings" value={totalFindings} color="#6366f1" />
                <StatPill icon={<ShieldAlert size={16} />} label="High Severity" value={highCount} color="#ef4444" />
                <StatPill icon={<AlertTriangle size={16} />} label="Medium Severity" value={medCount} color="#f59e0b" />
                <StatPill icon={<Info size={16} />} label="Low Severity" value={lowCount} color="#6366f1" />
            </div>

            {/* ── Top 3 Priority Risks ───────────────────── */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
                        <Zap size={15} color="#ef4444" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Priority Risks</h2>
                        <p className="text-xs" style={{ color: "#64748b" }}>Top 3 AI-ranked critical findings requiring immediate attention</p>
                    </div>
                </div>

                {[...scan.topRisks]
                    .sort((a, b) => {
                        const rankOrder = { High: 0, Medium: 1, Low: 2 };
                        return rankOrder[a.confidence] - rankOrder[b.confidence];
                    })
                    .map((r, index) => (
                        <RiskCard key={index} risk={{ ...r, rank: index + 1 }} />
                    ))}
            </div>

            {/* ── Additional findings table ───────────────── */}
            <div>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}>
                        <FileCode2 size={15} color="#818cf8" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Additional Findings</h2>
                        <p className="text-xs" style={{ color: "#64748b" }}>
                            #{scan.topRisks.length + 1}–{totalFindings} · {scan.findings.length} findings
                        </p>
                    </div>
                </div>

                <FindingsTable findings={scan.findings} />
            </div>
        </div>
    );
}
