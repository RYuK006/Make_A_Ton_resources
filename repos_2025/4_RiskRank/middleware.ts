import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED = ["/repos", "/results", "/issues"];
const secret = new TextEncoder().encode(
    process.env.JWT_SECRET ?? "zerohour-super-secret-jwt-key-change-in-prod"
);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
    if (!isProtected) return NextResponse.next();

    const token = req.cookies.get("zh_auth")?.value;
    if (!token) return redirectToLogin(req, pathname);

    try {
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch {
        return redirectToLogin(req, pathname);
    }
}

function redirectToLogin(req: NextRequest, pathname: string) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ["/repos/:path*", "/results/:path*", "/issues/:path*"],
};
