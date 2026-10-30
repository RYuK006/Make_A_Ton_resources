"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Zap, Activity, LogOut } from "lucide-react";
import { getCurrentScan } from "@/frontend/lib/store";

export function Topbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [project, setProject] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const scan = getCurrentScan();
        if (scan) setProject(scan.project);
        fetch("/api/auth/me")
            .then((r) => r.ok ? r.json() : null)
            .then((data) => { if (data?.email) setUser(data.email); });
    }, [pathname]);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        router.replace("/");
    }

    const breadcrumb =
        pathname === "/" ? "Home"
            : pathname === "/results" ? "Results"
                : "ZeroHour";

    return (
        <header
            className="fixed top-0 left-0 right-0 h-14 flex items-center px-6 gap-4 z-40"
            style={{
                background: "rgba(9,10,18,0.95)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            {/* Brand */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
                <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        boxShadow: "0 2px 10px rgba(99,102,241,0.4)",
                    }}
                >
                    <Zap size={14} color="#fff" />
                </div>
                <span className="text-white font-bold text-sm">ZeroHour</span>
            </div>

            {/* Divider */}
            <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm flex-1">
                <Activity size={13} className="text-indigo-400" />
                <span style={{ color: "#94a3b8" }}>{breadcrumb}</span>
                {project && (
                    <>
                        <span style={{ color: "#334155" }}>/</span>
                        <span
                            className="px-2 py-0.5 rounded text-xs font-mono font-semibold"
                            style={{ background: "rgba(99,102,241,0.1)", color: "#a78bfa", border: "1px solid rgba(99,102,241,0.2)" }}
                        >
                            {project}
                        </span>
                    </>
                )}
            </div>

            {/* User pill + Sign out */}
            {user && (
                <div className="flex items-center gap-2">
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                        style={{
                            background: "rgba(99,102,241,0.1)",
                            border: "1px solid rgba(99,102,241,0.2)",
                            color: "#a78bfa",
                        }}
                    >
                        <div
                            className="w-4 h-4 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", fontSize: 9 }}
                        >
                            {user[0].toUpperCase()}
                        </div>
                        {user}
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Sign out"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                        style={{
                            background: "rgba(239,68,68,0.07)",
                            border: "1px solid rgba(239,68,68,0.15)",
                            color: "#f87171",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(239,68,68,0.15)";
                            e.currentTarget.style.borderColor = "rgba(239,68,68,0.3)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(239,68,68,0.07)";
                            e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)";
                        }}
                    >
                        <LogOut size={12} />
                        Sign out
                    </button>
                </div>
            )}
        </header>
    );
}
