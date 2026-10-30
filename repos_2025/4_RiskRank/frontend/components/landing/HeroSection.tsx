"use client";

import { cn } from "@/frontend/lib/cn";
import { Button } from "@/frontend/components/ui/Button";
import { useRouter } from "next/navigation";

interface HeroSectionProps {
    className?: string;
}

export function HeroSection({ className }: HeroSectionProps) {
    const router = useRouter();

    return (
        <section
            className={cn(
                "relative flex flex-col items-center justify-center text-center px-6 py-24 min-h-screen overflow-hidden",
                className
            )}
        >
            {/* Glow background */}
            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(99,102,241,0.12) 0%, transparent 70%)",
                }}
            />

            {/* Badge */}
            <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#818cf8",
                }}
            >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI-Powered Security Scanning
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight max-w-3xl">
                Find vulnerabilities{" "}
                <span
                    style={{
                        backgroundImage:
                            "linear-gradient(135deg, #6366f1 0%, #a78bfa 50%, #38bdf8 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    before hackers do
                </span>
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-xl leading-relaxed">
                ZeroHour scans your repositories for critical security flaws, ranks
                them by business impact, and gives you clear remediation steps —
                powered by AI.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button
                    size="lg"
                    variant="primary"
                    onClick={() => router.push("/repos")}
                >
                    Start Scanning
                </Button>
                <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push("/")}
                >
                    Learn More
                </Button>
            </div>

            {/* Stats row */}
            <div className="mt-16 flex flex-wrap justify-center gap-8">
                {[
                    { label: "Vulnerabilities Found", value: "10k+" },
                    { label: "Repositories Scanned", value: "2k+" },
                    { label: "Avg Severity Reduction", value: "73%" },
                ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col items-center gap-1">
                        <span className="text-2xl font-extrabold text-white">{value}</span>
                        <span className="text-xs text-slate-500 uppercase tracking-widest">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
