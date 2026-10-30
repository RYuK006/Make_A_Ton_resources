import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/backend/db";
import ScanResult from "@/backend/models/ScanResult";
import Repository from "@/backend/models/Repository";
import { getSessionFromRequest } from "@/backend/auth";
import { MAX_UPLOAD_BYTES } from "@/backend/config/constants";
import mongoose from "mongoose";

/**
 * POST /api/scan
 *
 * Triggers a security scan for a given repository by name.
 * Expects a JSON body with the following shape:
 * {
 *   project:   string;          // repo/project name
 *   timestamp: string;          // ISO date string (optional)
 *   topRisks:  TopRiskDTO[];    // pre-analyzed top risks (optional)
 *   findings:  FindingDTO[];    // raw findings list
 * }
 *
 * Returns { id: string } on success (the new ScanResult document ID).
 */
export async function POST(req: NextRequest) {
    const session = await getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!body.project || typeof body.project !== "string") {
        return NextResponse.json(
            { error: "Missing required field: project" },
            { status: 400 }
        );
    }

    await connectDB();

    // Find or create the repository belonging to this user.
    let repo = await Repository.findOne({
        name: body.project,
        ownerId: session.userId,
    });
    if (!repo) {
        repo = await Repository.create({
            name: body.project,
            ownerId: new mongoose.Types.ObjectId(session.userId),
        });
    }

    // Tally severities from the findings array.
    const findings = (body.findings as Array<{ severity: string }>) ?? [];
    const high = findings.filter((f) => f.severity === "HIGH").length;
    const med = findings.filter((f) => f.severity === "MED").length;
    const low = findings.filter((f) => f.severity === "LOW").length;

    const scan = await ScanResult.create({
        repoId: repo._id,
        project: body.project,
        timestamp: body.timestamp ? new Date(body.timestamp as string) : new Date(),
        topRisks: body.topRisks ?? [],
        findings,
        high,
        med,
        low,
    });

    return NextResponse.json({ id: scan._id.toString() }, { status: 201 });
}

/**
 * GET /api/scan?repoId=<id>
 *
 * Returns a list of scan sessions (lightweight) for a given repository.
 * If no repoId is provided, returns all scans for the authenticated user.
 */
export async function GET(req: NextRequest) {
    const session = await getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const repoId = req.nextUrl.searchParams.get("repoId");
    await connectDB();

    const query = repoId ? { repoId } : {};
    const scans = await ScanResult.find(query)
        .sort({ timestamp: -1 })
        .select("_id project timestamp high med low repoId")
        .lean();

    const sessions = scans.map((s) => ({
        id: s._id.toString(),
        project: s.project,
        timestamp: s.timestamp,
        high: s.high,
        med: s.med,
        low: s.low,
    }));

    return NextResponse.json(sessions);
}
