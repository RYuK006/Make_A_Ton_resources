import { ScanResult, ScanSession } from "./types";

const KEY_SCAN = "zh_current_scan";
const KEY_HIST = "zh_scan_history";

export function setCurrentScan(scan: ScanResult) {
    if (typeof window !== "undefined") {
        localStorage.setItem(KEY_SCAN, JSON.stringify(scan));
    }
}

export function getCurrentScan(): ScanResult | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem(KEY_SCAN);
        return raw ? (JSON.parse(raw) as ScanResult) : null;
    } catch { return null; }
}

export function clearCurrentScan() {
    if (typeof window !== "undefined") localStorage.removeItem(KEY_SCAN);
}

/* ─── Scan History ─────────────────────────────────────── */

export function getScanHistory(): ScanSession[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(KEY_HIST);
        return raw ? (JSON.parse(raw) as ScanSession[]) : [];
    } catch { return []; }
}

export function addToHistory(session: ScanSession) {
    if (typeof window === "undefined") return;
    const hist = getScanHistory().filter((s) => s.id !== session.id);
    hist.unshift(session);
    localStorage.setItem(KEY_HIST, JSON.stringify(hist.slice(0, 60)));
}

export function seedHistoryIfEmpty(sessions: ScanSession[]) {
    if (typeof window === "undefined") return;
    if (getScanHistory().length === 0) {
        localStorage.setItem(KEY_HIST, JSON.stringify(sessions));
    }
}
