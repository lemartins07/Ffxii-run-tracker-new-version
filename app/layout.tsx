import type { ReactNode } from "react";
import "../src/index.css";
import { AppShell } from "./AppShell";

export const metadata = {
  title: "FFXII Run Tracker",
  description: "Final Fantasy XII run tracker and guide",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

