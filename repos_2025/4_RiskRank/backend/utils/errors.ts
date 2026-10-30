/**
 * Custom application error classes.
 * Throw these inside API handlers; catch at boundaries for predictable status codes.
 */

export class AppError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number = 500
    ) {
        super(message);
        this.name = "AppError";
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
        this.name = "ValidationError";
    }
}

export class AuthError extends AppError {
    constructor(message = "Unauthenticated") {
        super(message, 401);
        this.name = "AuthError";
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
        this.name = "ForbiddenError";
    }
}

export class NotFoundError extends AppError {
    constructor(resource = "Resource") {
        super(`${resource} not found`, 404);
        this.name = "NotFoundError";
    }
}

/** Safely extract an error message from an unknown thrown value. */
export function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    return String(err);
}
