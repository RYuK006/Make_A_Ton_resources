/** Application-wide backend constants. */

// ── Auth ─────────────────────────────────────────────────────
/** Name of the JWT auth cookie. */
export const AUTH_COOKIE = "zh_auth";

/** Default JWT expiry duration (used when issuing tokens). */
export const JWT_EXPIRY = "7d";

// ── Database ─────────────────────────────────────────────────
/** Max scan sessions to keep per user in scan history. */
export const MAX_SCAN_HISTORY = 60;

// ── Pagination ───────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ── Upload ───────────────────────────────────────────────────
/** Maximum upload file size in bytes (10 MB). */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Allowed MIME types for code archive uploads. */
export const ALLOWED_UPLOAD_TYPES = [
    "application/zip",
    "application/x-zip-compressed",
    "application/gzip",
    "application/x-tar",
];

// ── Scan ─────────────────────────────────────────────────────
/** Severity levels in descending order. */
export const SEVERITY_ORDER = ["HIGH", "MED", "LOW"] as const;

/** Confidence levels in descending order. */
export const CONFIDENCE_ORDER = ["High", "Medium", "Low"] as const;
