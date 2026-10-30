import { SignJWT, jwtVerify } from "jose";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const COOKIE = "zh_auth";
const secret = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "zerohour-fallback-secret"
);

export interface JWTPayload {
    userId: string;
    email: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
    return new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as JWTPayload;
    } catch {
        return null;
    }
}

/** Read zh_auth cookie and return the decoded payload (server components / API routes) */
export async function getSession(): Promise<JWTPayload | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE)?.value;
    if (!token) return null;
    return verifyToken(token);
}

/** Read zh_auth from an incoming API request */
export async function getSessionFromRequest(
    req: NextRequest
): Promise<JWTPayload | null> {
    const token = req.cookies.get(COOKIE)?.value;
    if (!token) return null;
    return verifyToken(token);
}

export { COOKIE };
