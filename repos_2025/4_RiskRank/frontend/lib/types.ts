export type Confidence = "High" | "Medium" | "Low";
export type Severity = "HIGH" | "MED" | "LOW";

export interface TopRisk {
  rank: number;
  title: string;
  reason: string;
  businessImpact: string;
  remediation: string;
  vulnerableCode: string;
  location: string;
  confidence: Confidence;
}

export interface Finding {
  id: number;
  severity: Severity;
  file: string;
  line: number;
  message: string;
}

export interface ScanResult {
  id: string;
  project: string;
  timestamp: string;
  topRisks: TopRisk[];
  findings: Finding[];
}

/** Lightweight entry shown in the sidebar history */
export interface ScanSession {
  id: string;
  project: string;
  timestamp: string;
  high: number;
  med: number;
  low: number;
  fixedVs?: string;   // id of the previous session this one improved upon
  fixedCount?: number; // how many issues were fixed vs previous session
}
