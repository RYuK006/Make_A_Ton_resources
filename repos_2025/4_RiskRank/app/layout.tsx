import type { Metadata } from "next";
import "./globals.css";
import { LayoutShell } from "@/frontend/components/layout/LayoutShell";

export const metadata: Metadata = {
  title: "ZeroHour Dashboard",
  description: "Security risk insights for your codebase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
