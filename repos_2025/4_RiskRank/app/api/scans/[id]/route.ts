import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/backend/db";
import Project from "@/backend/models/Project";
import { getSessionFromRequest } from "@/backend/auth";

/* ── Severity mappings ───────────────────────────────── */

// topFinding.severity → confidence label shown in UI
function toConfidence(sev: string): "High" | "Medium" | "Low" {
    const s = sev?.toLowerCase() ?? "";
    if (s === "critical" || s === "high") return "High";
    if (s === "medium" || s === "moderate") return "Medium";
    return "Low";
}

// rawFinding.severity → finding severity badge
function toSeverity(sev: string): "HIGH" | "MED" | "LOW" {
    const s = sev?.toUpperCase() ?? "";
    if (s === "ERROR" || s === "CRITICAL") return "HIGH";
    if (s === "WARNING" || s === "HIGH") return "MED";
    return "LOW";
}

/* GET /api/scans/[id] */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    // Look up the Project document by _id
    const project = await Project.findById(id).lean();
    if (!project) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Map topFindings → topRisks (shape the frontend results page expects)
    const topRisks = (project.topFindings ?? []).map((f, idx) => ({
        rank: f.rank ?? idx + 1,
        title: f.title ?? "Unknown",
        reason: f.explanation ?? f.message ?? "",
        businessImpact: f.businessImpact ?? "",
        remediation: f.remediation ?? "",
        vulnerableCode: f.snippet !== "requires login" ? (f.snippet ?? "") : `// see ${f.path}:${f.startLine}`,
        location: `${f.path ?? ""}${f.startLine ? `:${f.startLine}` : ""}`,
        confidence: toConfidence(f.confidence ?? f.severity),
    }));

    // Map rawFindings → findings, then sort HIGH → MED → LOW
    const SEV_ORDER: Record<string, number> = { HIGH: 0, MED: 1, LOW: 2 };
    const findings = (project.rawFindings ?? [])
        .map((f, idx) => ({
            id: idx + 1,
            severity: toSeverity(f.severity),
            file: f.path ?? "",
            line: f.startLine ?? 0,
            message: f.message ?? "",
        }))
        .sort((a, b) => (SEV_ORDER[a.severity] ?? 3) - (SEV_ORDER[b.severity] ?? 3));

    // Re-number after sort so ids are sequential
    findings.forEach((f, i) => { f.id = i + 1; });

    const high = findings.filter((f) => f.severity === "HIGH").length;
    const med = findings.filter((f) => f.severity === "MED").length;
    const low = findings.filter((f) => f.severity === "LOW").length;

    return NextResponse.json({
        id: project._id.toString(),
        project: project.projectName,
        timestamp: project.createdAt,
        topRisks,
        findings,
        high: (project.metrics?.critical ?? 0) + (project.metrics?.high ?? 0),
        med: project.metrics?.medium ?? med,
        low: project.metrics?.low ?? low,
    });
}

