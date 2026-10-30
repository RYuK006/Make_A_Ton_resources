import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/backend/db";
import Project from "@/backend/models/Project";
import { getSessionFromRequest } from "@/backend/auth";

/* ── Language colour map ─────────────────────────────── */
const LANG_COLORS: Record<string, string> = {
    react: "#61dafb",
    javascript: "#f1e05a",
    typescript: "#3178c6",
    python: "#3572a5",
    java: "#b07219",
    php: "#4f5d95",
    ruby: "#701516",
    go: "#00add8",
    rust: "#dea584",
    vue: "#41b883",
    angular: "#dd0031",
    svelte: "#ff3e00",
};

function langColor(frameworks: string[]): string {
    for (const fw of frameworks) {
        const key = fw.toLowerCase();
        if (LANG_COLORS[key]) return LANG_COLORS[key];
    }
    return "#6366f1";
}

/* GET /api/repos — list one card per unique project (latest scan only) */
export async function GET(req: NextRequest) {
    const session = await getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    await connectDB();

    // Fetch all, sorted newest first
    const all = await Project.find({})
        .sort({ createdAt: -1 })
        .lean();

    // Deduplicate: keep only the latest scan per projectName
    const seen = new Set<string>();
    const projects = all.filter((p) => {
        const key = p.projectName?.toLowerCase() ?? p._id.toString();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    const repos = projects.map((p) => ({
        _id: p._id.toString(),
        id: p._id.toString(),
        name: p.projectName,
        description: `${p.repositoryUrl !== "local" ? p.repositoryUrl : "Local repository"} · Branch: ${p.branch}`,
        language: p.frameworks?.[0] ?? "Unknown",
        languageColor: langColor(p.frameworks ?? []),
        status: p.status,
        latestScan: {
            _id: p._id.toString(),
            high: (p.metrics?.critical ?? 0) + (p.metrics?.high ?? 0),
            med: p.metrics?.medium ?? 0,
            low: p.metrics?.low ?? 0,
            critical: p.metrics?.critical ?? 0,
            timestamp: p.createdAt,
        },
    }));

    return NextResponse.json(repos);
}

/* POST /api/repos — (kept for future use) */
export async function POST(req: NextRequest) {
    const session = await getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const body = await req.json();
    await connectDB();

    const project = await Project.create({
        projectName: body.name,
        repositoryUrl: body.repositoryUrl ?? "local",
        branch: body.branch ?? "main",
        frameworks: body.frameworks ?? [],
        metrics: { critical: 0, high: 0, medium: 0, low: 0 },
    });

    return NextResponse.json({ id: project._id.toString() }, { status: 201 });
}

