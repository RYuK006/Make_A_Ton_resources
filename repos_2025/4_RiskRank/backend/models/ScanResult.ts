import mongoose, { Schema, Document, Model } from "mongoose";

/* ── Sub-schemas ─────────────────────────────────────── */
const TopRiskSchema = new Schema(
    {
        rank: Number,
        title: String,
        reason: String,
        businessImpact: String,
        remediation: String,
        vulnerableCode: String,
        location: String,
        confidence: { type: String, enum: ["High", "Medium", "Low"] },
    },
    { _id: false }
);

const FindingSchema = new Schema(
    {
        id: Number,
        severity: { type: String, enum: ["HIGH", "MED", "LOW"] },
        file: String,
        line: Number,
        message: String,
    },
    { _id: false }
);

/* ── Main document ───────────────────────────────────── */
export interface IScanResult extends Document {
    repoId: mongoose.Types.ObjectId;
    project: string;
    timestamp: Date;
    topRisks: object[];
    findings: object[];
    high: number;
    med: number;
    low: number;
    createdAt: Date;
}

const ScanResultSchema = new Schema<IScanResult>({
    repoId: { type: Schema.Types.ObjectId, ref: "Repository", required: true },
    project: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    topRisks: [TopRiskSchema],
    findings: [FindingSchema],
    high: { type: Number, default: 0 },
    med: { type: Number, default: 0 },
    low: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const ScanResult: Model<IScanResult> =
    mongoose.models.ScanResult ??
    mongoose.model<IScanResult>("ScanResult", ScanResultSchema);

export default ScanResult;
