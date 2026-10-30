import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/backend/db";
import Repository from "@/backend/models/Repository";
import ScanResult from "@/backend/models/ScanResult";
import { getSessionFromRequest } from "@/backend/auth";

/* GET /api/repos/[id] */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });

    const { id } = await params;
    await connectDB();

    const repo = await Repository.findById(id).lean();
    if (!repo) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const scans = await ScanResult.find({ repoId: id })
        .sort({ timestamp: -1 })
        .select("_id high med low timestamp project")
        .lean();

    return NextResponse.json({ ...repo, id: repo._id.toString(), scans });
}
