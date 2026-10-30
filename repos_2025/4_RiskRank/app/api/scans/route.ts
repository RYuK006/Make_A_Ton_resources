import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/backend/db";
import Project from "@/backend/models/Project";
import { getSessionFromRequest } from "@/backend/auth";

/* GET /api/scans?projectName=<name>
 * Returns all scan sessions for a given project name (for sidebar history). */
export async function GET(req: NextRequest) {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const projectName = req.nextUrl.searchParams.get("projectName");
    await connectDB();

    const query = projectName ? { projectName } : {};
    const scans = await Project.find(query)
        .sort({ createdAt: -1 })
        .select("_id projectName metrics createdAt")
        .lean();

    const sessions = scans.map((s) => ({
        id: s._id.toString(),
        project: s.projectName,
        timestamp: s.createdAt,
        high: (s.metrics?.critical ?? 0) + (s.metrics?.high ?? 0),
        med: s.metrics?.medium ?? 0,
        low: s.metrics?.low ?? 0,
    }));

    return NextResponse.json(sessions);
}
