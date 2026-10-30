"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, GitFork, Clock, Folder, Zap, Loader2 } from "lucide-react";
import { setCurrentScan } from "@/frontend/lib/store";
import { MOCK_SCAN } from "@/frontend/lib/mock-data";

/* ─── Types ──────────────────────────────────────────── */
interface RepoItem {
    _id: string;
    id: string;
    name: string;
    description: string;
    language: string;
    languageColor: string;
    status?: string;
    latestScan: { _id: string; high: number; med: number; low: number; critical?: number; timestamp: string } | null;
}

/* ─── helpers ─────────────────────────────────────────── */
function riskColor(r: RepoItem): string {
    const critical = r.latestScan?.critical ?? 0;
    const h = r.latestScan?.high ?? 0;
    const m = r.latestScan?.med ?? 0;
    if (critical >= 1) return "#ef4444";
    if (h >= 4) return "#f97316";
    if (m >= 8) return "#f59e0b";
    return "#22c55e";
}

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

/* ─── Repo Card ─────────────────────────────────────────── */
function RepoCard({ repo }: { repo: RepoItem }) {
    const router = useRouter();
    const [hovered, setHovered] = useState(false);
    const color = riskColor(repo);

    async function handleClick() {
        if (repo.latestScan) {
            try {
                const res = await fetch(`/api/scans/${repo.latestScan._id}`);
                if (res.ok) {
                    const scan = await res.json();
                    setCurrentScan(scan);
                    router.push("/results");
                    return;
                }
            } catch { /* fall through to mock */ }
        }
        // Fallback to mock if no real scan yet
        setCurrentScan({ ...MOCK_SCAN, project: repo.name });
        router.push("/results");
    }

    return (
        <div
            className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
            style={{
                background: hovered ? "rgba(20,21,35,0.98)" : "rgba(15,16,28,0.95)",
                border: `1px solid ${hovered ? `${color}55` : "rgba(255,255,255,0.07)"}`,
                boxShadow: hovered
                    ? `0 8px 40px ${color}25, 0 2px 0 ${color}50`
                    : "0 2px 12px rgba(0,0,0,0.3)",
                transform: hovered ? "translateY(-2px)" : "none",
            }}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Top color stripe */}
            <div
                className="h-0.5 w-full"
                style={{ background: `linear-gradient(90deg, ${color}90, ${color}30, transparent)` }}
            />

            <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}
                    >
                        <GitFork size={16} color="#818cf8" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm leading-tight">{repo.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-2 h-2 rounded-full inline-block" style={{ background: repo.languageColor }} />
                            <span className="text-xs" style={{ color: "#64748b" }}>{repo.language}</span>
                        </div>
                    </div>
                </div>

                <p className="text-xs leading-relaxed mb-3 line-clamp-2" style={{ color: "#64748b" }}>
                    {repo.description || "No description available."}
                </p>

                {/* Severity pills */}
                {repo.latestScan && (
                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                        {(repo.latestScan.critical ?? 0) > 0 && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
                                {repo.latestScan.critical} Critical
                            </span>
                        )}
                        {repo.latestScan.high > 0 && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: "rgba(251,146,60,0.15)", color: "#fb923c", border: "1px solid rgba(251,146,60,0.3)" }}>
                                {repo.latestScan.high} High
                            </span>
                        )}
                        {repo.latestScan.med > 0 && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: "rgba(250,204,21,0.15)", color: "#fbbf24", border: "1px solid rgba(250,204,21,0.3)" }}>
                                {repo.latestScan.med} Med
                            </span>
                        )}
                        {repo.latestScan.low > 0 && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.3)" }}>
                                {repo.latestScan.low} Low
                            </span>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#475569" }}>
                    <Clock size={11} />
                    <span>
                        {repo.latestScan
                            ? `Scanned ${timeAgo(repo.latestScan.timestamp)}`
                            : "Not yet scanned"}
                    </span>
                </div>
            </div>
        </div>

    );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function ReposPage() {
    const [repos, setRepos] = useState<RepoItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/repos")
            .then((r) => r.json())
            .then((data) => {
                setRepos(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = repos.filter(
        (r) =>
            r.name.toLowerCase().includes(search.toLowerCase()) ||
            (r.description ?? "").toLowerCase().includes(search.toLowerCase()) ||
            r.language.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            {/* ── Page Header ─────────────────────────── */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1" style={{ color: "#64748b" }}>
                    <Folder size={13} />
                    <span className="text-xs font-mono tracking-widest uppercase">Projects</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">Projects</h1>
                <p className="text-sm mt-1" style={{ color: "#475569" }}>
                    {loading ? "Loading…" : `${repos.length} scanned projects — click any to view its security report`}
                </p>
            </div>

            {/* ── Search ──────────────────────────────── */}
            <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-7 max-w-md"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
                <Search size={14} style={{ color: "#475569" }} />
                <input
                    type="text"
                    placeholder="Search by name, language or description…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent text-sm outline-none flex-1"
                    style={{ color: "#94a3b8" }}
                />
            </div>

            {/* ── Grid / States ────────────────────────── */}
            {loading ? (
                <div className="flex items-center justify-center py-24" style={{ color: "#475569" }}>
                    <Loader2 size={28} className="animate-spin mr-3" />
                    <span className="text-sm">Loading projects…</span>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24" style={{ color: "#475569" }}>
                    <Zap size={32} className="mx-auto mb-4 opacity-30" />
                    <p className="text-sm">No projects match your search</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((repo) => (
                        <RepoCard key={repo._id} repo={repo} />
                    ))}
                </div>
            )}
        </div>
    );
}
