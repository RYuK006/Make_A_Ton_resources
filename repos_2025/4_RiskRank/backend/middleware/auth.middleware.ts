import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/backend/auth";

/**
 * Wraps an API route handler and enforces JWT authentication.
 * Returns 401 JSON if the request has no valid session cookie.
 *
 * Usage:
 *   export const GET = withAuth(async (req, session) => { ... });
 */
export type AuthedHandler = (
    req: NextRequest,
    session: { userId: string; email: string }
) => Promise<NextResponse>;

export function withAuth(handler: AuthedHandler) {
    return async function (req: NextRequest): Promise<NextResponse> {
        const session = await getSessionFromRequest(req);
        if (!session) {
            return NextResponse.json(
                { error: "Unauthenticated" },
                { status: 401 }
            );
        }
        return handler(req, session);
    };
}

/**
 * Lightweight guard — call inside a route handler and early-return
 * the result if it is a NextResponse (means auth failed).
 *
 * Usage:
 *   const [session, guard] = await requireAuth(req);
 *   if (guard) return guard;
 */
export async function requireAuth(
    req: NextRequest
): Promise<[{ userId: string; email: string } | null, NextResponse | null]> {
    const session = await getSessionFromRequest(req);
    if (!session) {
        return [
            null,
            NextResponse.json({ error: "Unauthenticated" }, { status: 401 }),
        ];
    }
    return [session, null];
}
