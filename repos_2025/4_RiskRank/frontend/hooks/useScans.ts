"use client";

import { useState, useEffect, useCallback } from "react";
import type { ScanSession, ScanResult } from "@/frontend/lib/types";

// ── useScans ──────────────────────────────────────────────────

interface UseScansOptions {
    repoId?: string;
}

interface UseScansReturn {
    sessions: ScanSession[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * useScans — fetches scan sessions from GET /api/scans[?repoId=…].
 */
export function useScans({ repoId }: UseScansOptions = {}): UseScansReturn {
    const [sessions, setSessions] = useState<ScanSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchScans = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const url = repoId
                ? `/api/scans?repoId=${encodeURIComponent(repoId)}`
                : "/api/scans";
            const res = await fetch(url, { credentials: "include" });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error((body as { error?: string }).error ?? "Failed to fetch scans");
            }
            const data = await res.json();
            setSessions(data as ScanSession[]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [repoId]);

    useEffect(() => {
        fetchScans();
    }, [fetchScans]);

    return { sessions, loading, error, refetch: fetchScans };
}

// ── useScanDetail ─────────────────────────────────────────────

interface UseScanDetailReturn {
    scan: ScanResult | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

/**
 * useScanDetail — fetches a full scan result by ID from GET /api/scans/:id.
 */
export function useScanDetail(scanId: string | null): UseScanDetailReturn {
    const [scan, setScan] = useState<ScanResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDetail = useCallback(async () => {
        if (!scanId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/scans/${scanId}`, {
                credentials: "include",
            });
            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error((body as { error?: string }).error ?? "Failed to fetch scan");
            }
            const data = await res.json();
            setScan(data as ScanResult);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    }, [scanId]);

    useEffect(() => {
        fetchDetail();
    }, [fetchDetail]);

    return { scan, loading, error, refetch: fetchDetail };
}
