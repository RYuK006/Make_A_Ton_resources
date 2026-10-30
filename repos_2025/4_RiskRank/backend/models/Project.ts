import mongoose, { Schema, Document, Model } from "mongoose";

/* ── Sub-schemas ─────────────────────────────────────── */

const TopFindingSchema = new Schema(
    {
        id: String,
        title: String,
        message: String,
        severity: String,       // "Critical" | "High" | "Medium" | "Low"
        explanation: String,
        businessImpact: String,
        remediation: String,
        confidence: String,     // "High" | "Medium" | "Low"
        snippet: String,
        path: String,
        startLine: Number,
        rank: Number,
    },
    { _id: true }
);

const RawFindingSchema = new Schema(
    {
        id: String,
        message: String,
        severity: String,       // "ERROR" | "WARNING" | "INFO"
        snippet: String,
        path: String,
        startLine: Number,
    },
    { _id: true }
);

/* ── Interfaces ──────────────────────────────────────── */

export interface ITopFinding {
    id: string;
    title: string;
    message: string;
    severity: string;
    explanation: string;
    businessImpact: string;
    remediation: string;
    confidence: string;
    snippet: string;
    path: string;
    startLine: number;
    rank: number;
}

export interface IRawFinding {
    id: string;
    message: string;
    severity: string;
    snippet: string;
    path: string;
    startLine: number;
}

export interface IProject extends Document {
    projectName: string;
    repositoryUrl: string;
    branch: string;
    frameworks: string[];
    totalPrioritized: number;
    totalRaw: number;
    metrics: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    status: string;
    topFindings: ITopFinding[];
    rawFindings: IRawFinding[];
    createdAt: Date;
}

/* ── Main schema ─────────────────────────────────────── */

const ProjectSchema = new Schema<IProject>({
    projectName: { type: String, required: true },
    repositoryUrl: { type: String, default: "" },
    branch: { type: String, default: "main" },
    frameworks: [String],
    totalPrioritized: { type: Number, default: 0 },
    totalRaw: { type: Number, default: 0 },
    metrics: {
        critical: { type: Number, default: 0 },
        high: { type: Number, default: 0 },
        medium: { type: Number, default: 0 },
        low: { type: Number, default: 0 },
    },
    status: { type: String, default: "Pending Review" },
    topFindings: [TopFindingSchema],
    rawFindings: [RawFindingSchema],
    createdAt: { type: Date, default: Date.now },
});

// Always delete the cached model in dev to avoid stale collection name after hot-reloads
if (mongoose.models.Project) delete mongoose.models.Project;

const Project: Model<IProject> =
    mongoose.model<IProject>("Project", ProjectSchema, "scanresults");

export default Project;
