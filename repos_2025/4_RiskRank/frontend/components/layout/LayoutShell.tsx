"use client";

import { usePathname } from "next/navigation";
import { Topbar } from "./Topbar";
import { ResultsSidebar } from "./ResultsSidebar";

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname === "/";
    const isResults = pathname === "/results";

    if (isLogin) {
        return (
            <>
                <div className="bg-glow" />
                {children}
            </>
        );
    }

    return (
        <>
            <div className="bg-glow" />
            <Topbar />

            {/* Sidebar only on /results */}
            {isResults && <ResultsSidebar />}

            <main
                style={{
                    marginTop: "56px",
                    // When sidebar is present, content is offset; sidebar starts at 256px and
                    // collapses to 52px — we use a CSS var set by the sidebar via data-collapsed
                    // For simplicity we hard-code the expanded state; sidebar manages its own width
                    marginLeft: isResults ? "256px" : "0",
                    minHeight: "100vh",
                    position: "relative",
                    zIndex: 1,
                    transition: "margin-left 0.3s ease",
                }}
            >
                {children}
            </main>
        </>
    );
}
