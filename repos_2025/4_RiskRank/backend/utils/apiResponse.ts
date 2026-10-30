import { NextResponse } from "next/server";

/** 200 OK */
export function ok<T>(data: T, status = 200): NextResponse {
    return NextResponse.json(data, { status });
}

/** 201 Created */
export function created<T>(data: T): NextResponse {
    return NextResponse.json(data, { status: 201 });
}

/** 400 Bad Request */
export function badRequest(message = "Bad request"): NextResponse {
    return NextResponse.json({ error: message }, { status: 400 });
}

/** 401 Unauthorized */
export function unauthorized(message = "Unauthenticated"): NextResponse {
    return NextResponse.json({ error: message }, { status: 401 });
}

/** 403 Forbidden */
export function forbidden(message = "Forbidden"): NextResponse {
    return NextResponse.json({ error: message }, { status: 403 });
}

/** 404 Not Found */
export function notFound(message = "Not found"): NextResponse {
    return NextResponse.json({ error: message }, { status: 404 });
}

/** 500 Internal Server Error */
export function serverError(message = "Internal server error"): NextResponse {
    return NextResponse.json({ error: message }, { status: 500 });
}
