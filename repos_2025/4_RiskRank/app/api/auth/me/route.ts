import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/backend/auth";

export async function GET(req: NextRequest) {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    return NextResponse.json({ userId: session.userId, email: session.email });
}
