"use client";

import type { ReactNode } from "react";
import { Header as AppHeader } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { PlaythroughOnboarding } from "@/components/PlaythroughOnboarding";
import { PlaythroughSelector } from "@/components/PlaythroughSelector";
import { useSettingsStore } from "@/stores/useSettingsStore";

export function AppShell({ children }: { children: ReactNode }) {
  const {
    hasCompletedOnboarding,
    completeOnboarding,
    playthroughs,
  } = useSettingsStore();

  // Global onboarding flow
  if (!hasCompletedOnboarding && playthroughs.length === 0) {
    return (
      <ThemeProvider>
        <PlaythroughOnboarding
          onComplete={() => {
            completeOnboarding();
          }}
        />
        <Toaster />
      </ThemeProvider>
    );
  }

  if (!hasCompletedOnboarding && playthroughs.length > 0) {
    return (
      <ThemeProvider>
        <PlaythroughSelector
          onSelect={() => {
            completeOnboarding();
          }}
        />
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col bg-background">
        <AppHeader />
        <div className="flex-1 overflow-auto">{children}</div>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
