import { Types } from "mongoose";

// ── Auth ─────────────────────────────────────────────────────

export interface JWTPayload {
    userId: string;
    email: string;
}

// ── User ─────────────────────────────────────────────────────

export interface UserDTO {
    id: string;
    email: string;
    createdAt: string;
}

// ── Repository ───────────────────────────────────────────────

export interface RepositoryDTO {
    id: string;
    name: string;
    description: string;
    language: string;
    languageColor: string;
    ownerId: string;
    createdAt: string;
}

// ── Scan ─────────────────────────────────────────────────────

export type Severity = "HIGH" | "MED" | "LOW";
export type Confidence = "High" | "Medium" | "Low";

export interface FindingDTO {
    id: number;
    severity: Severity;
    file: string;
    line: number;
    message: string;
}

export interface TopRiskDTO {
    rank: number;
    title: string;
    reason: string;
    businessImpact: string;
    remediation: string;
    vulnerableCode: string;
    location: string;
    confidence: Confidence;
}

export interface ScanResultDTO {
    id: string;
    repoId: string;
    project: string;
    timestamp: string;
    topRisks: TopRiskDTO[];
    findings: FindingDTO[];
    high: number;
    med: number;
    low: number;
}

export interface ScanSessionDTO {
    id: string;
    project: string;
    timestamp: string;
    high: number;
    med: number;
    low: number;
}

// ── Upload ───────────────────────────────────────────────────

export interface UploadResult {
    filename: string;
    size: number;
    repoId?: string;
}

// ── API helpers ──────────────────────────────────────────────

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

export type ObjectId = Types.ObjectId;
