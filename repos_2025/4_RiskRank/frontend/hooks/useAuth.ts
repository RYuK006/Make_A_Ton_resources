"use client";

import { useState, useEffect, useCallback } from "react";

interface AuthUser {
    userId: string;
    email: string;
}

interface UseAuthReturn {
    user: AuthUser | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
    logout: () => Promise<void>;
}

/**
 * useAuth — fetches the current session from GET /api/auth/me and exposes
 * user info, loading state, and a logout helper.
 */
export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/auth/me", { credentials: "include" });
            if (res.ok) {
                const data = await res.json();
                setUser(data as AuthUser);
            } else {
                setUser(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Network error");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const logout = useCallback(async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    }, []);

    return { user, loading, error, refetch: fetchUser, logout };
}
