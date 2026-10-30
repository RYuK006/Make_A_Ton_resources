import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/backend/db";
import ScanResult from "@/backend/models/ScanResult";
import { getSessionFromRequest } from "@/backend/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getSessionFromRequest(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    try {
        await connectDB();
        const scan = await ScanResult.findById(params.id).lean();

        if (!scan) {
            return NextResponse.json({ error: "Scan not found" }, { status: 404 });
        }

        return NextResponse.json(scan);
    } catch (error) {
        console.error("Error fetching scan:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
