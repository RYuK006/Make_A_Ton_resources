"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import Image from "next/image";
import LogoImage from "@/frontend/image/1200x630wa-Photoroom.png";
import Hyperspeed from "@/frontend/components/ui/Hyperspeed";
import { hyperspeedPresets } from "@/frontend/components/ui/HyperSpeedPresets";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/repos";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => { if (r.ok) router.replace(redirect); });
  }, [redirect, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Please fill in both fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username.trim(), password }),
      });
      if (res.ok) {
        router.replace(redirect);
      } else {
        const data = await res.json();
        setError(data.error ?? "Invalid username or password.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative"
      style={{ background: "#000" }}
    >
      {/* Hyperspeed animated background */}
      <Hyperspeed
        effectOptions={hyperspeedPresets.six}
      />
      {/* Subtle dark overlay so the form stays readable */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "rgba(0,0,0,0.25)" }} />

      <div className="relative w-full max-w-xs flex flex-col items-center mt-24">

        {/* Logo Block */}
        <div className="flex flex-col items-center mb-4 w-[600px] pointer-events-none">
          <Image
            src={LogoImage}
            alt="RiskRank Logo"
            width={800}
            height={400}
            className="object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            priority
          />
          <h1 className="text-4xl font-black text-white tracking-widest drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] -mt-16">
            RISKRANK
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 w-full">
          {/* Username */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            className="w-full px-4 py-2.5 rounded-full text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              color: "#e2e8f0",
              backdropFilter: "blur(12px)",
            }}
            onFocus={(e) => (e.target.style.background = "rgba(255,255,255,0.15)")}
            onBlur={(e) => (e.target.style.background = "rgba(255,255,255,0.08)")}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full px-4 py-2.5 rounded-full text-sm outline-none transition-all pr-10"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                color: "#e2e8f0",
                backdropFilter: "blur(12px)",
              }}
              onFocus={(e) => (e.target.style.background = "rgba(255,255,255,0.15)")}
              onBlur={(e) => (e.target.style.background = "rgba(255,255,255,0.08)")}
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "#475569" }}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#fca5a5",
              }}
            >
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-1/3 mx-auto flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold text-white transition-all"
            style={{
              background: loading
                ? "rgba(99,102,241,0.5)"
                : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              boxShadow: loading ? "none" : "0 4px 16px rgba(99,102,241,0.35)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <LogIn size={14} />
            )}
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
