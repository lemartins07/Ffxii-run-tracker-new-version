import { useState } from "react";
import { Header } from "./components/Header";
import { GuideSidebar } from "./components/GuideSidebar";
import { GuideSectionHeader } from "./components/GuideSectionHeader";
import { GuideSectionChecklist } from "./components/GuideSectionChecklist";
import { GuideSectionDetailsPanel } from "./components/GuideSectionDetailsPanel";
import { Dashboard } from "./components/Dashboard";
import { HuntsPage } from "./components/HuntsPage";
import { AboutPage } from "./components/AboutPage";
import { PlaythroughOnboarding } from "./components/PlaythroughOnboarding";
import { PlaythroughSelector } from "./components/PlaythroughSelector";
import { ThemeProvider } from "./components/ThemeProvider";
import { NavigationProvider } from "./contexts/NavigationContext";
import { Toaster } from "./components/ui/sonner";
import { useSettingsStore } from "./stores/useSettingsStore";
import { useChecklistStore } from "./stores/useChecklistStore";
import {
  getStorySections,
  buildGuideSectionFull,
} from "./lib/guide-data";
import { Button } from "./components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Page = "dashboard" | "guide" | "hunts" | "about";

function AppContent() {
  const { hasCompletedOnboarding, completeOnboarding, playthroughs } = useSettingsStore();
  const [showSelector, setShowSelector] = useState(false);
  const [currentPage, setCurrentPage] =
    useState<Page>("dashboard");
  const [currentSectionCode, setCurrentSectionCode] =
    useState("wt01a");
  const storySections = getStorySections();
  const currentPlaythroughId = useSettingsStore(
    (state) => state.currentPlaythroughId,
  );
  const getSectionProgress = useChecklistStore(
    (state) => state.getSectionProgress,
  );

  // Show onboarding if first time
  if (!hasCompletedOnboarding && playthroughs.length === 0) {
    return (
      <PlaythroughOnboarding 
        onComplete={() => {
          completeOnboarding();
          setShowSelector(false);
        }} 
      />
    );
  }

  // Show selector if has runs but haven't selected yet
  if (!hasCompletedOnboarding && playthroughs.length > 0) {
    return (
      <PlaythroughSelector 
        onSelect={() => {
          completeOnboarding();
          setShowSelector(false);
        }} 
      />
    );
  }

  // Show selector if explicitly requested
  if (showSelector) {
    return (
      <PlaythroughSelector 
        onSelect={() => setShowSelector(false)} 
      />
    );
  }

  // Navigation handler
  const navigateTo = (page: Page, sectionCode?: string) => {
    setCurrentPage(page);
    if (sectionCode) {
      setCurrentSectionCode(sectionCode);
    }
  };

  // Render page based on current route
  const renderPage = () => {
    if (currentPage === "dashboard") {
      return <Dashboard />;
    }

    if (currentPage === "hunts") {
      return <HuntsPage />;
    }

    if (currentPage === "about") {
      return <AboutPage />;
    }

    // Guide page
    const section = buildGuideSectionFull(currentSectionCode);

    if (!section) {
      return (
        <div className="h-full flex items-center justify-center">
          <p>Section not found</p>
        </div>
      );
    }

    // Build checklist item IDs for progress calculation
    const itemIds = [
      `${section.toc.code}:main`,
      ...section.children
        .filter((c) => c.kind === "mark")
        .map((m) => `${m.code}:mark`),
      ...section.children
        .filter((c) => c.kind === "loot")
        .map((l) => `${l.code}:loot`),
    ];
    if (
      section.entry?.shops &&
      section.entry.shops.length > 0
    ) {
      itemIds.push(`${section.toc.code}:shops`);
    }

    const progress = getSectionProgress(
      currentPlaythroughId,
      itemIds,
    );

    // Navigation
    const currentIndex = storySections.findIndex(
      (s) => s.code === currentSectionCode,
    );
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < storySections.length - 1;

    const goToPrev = () => {
      if (hasPrev) {
        setCurrentSectionCode(
          storySections[currentIndex - 1].code,
        );
      }
    };

    const goToNext = () => {
      if (hasNext) {
        setCurrentSectionCode(
          storySections[currentIndex + 1].code,
        );
      }
    };

    return (
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Navigation */}
        <GuideSidebar
          sections={storySections}
          activeCode={currentSectionCode}
          className="hidden lg:block w-64 xl:w-72"
        />

        {/* Main Content - Guide Narrative */}
        <main className="flex-1 overflow-auto">
          <div className="container max-w-5xl py-6 px-4 lg:px-6 space-y-6">
            <GuideSectionHeader
              section={section}
              progressPercent={progress.percent}
              completedCount={progress.completed}
              totalCount={progress.total}
            />

            <GuideSectionDetailsPanel section={section} />

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={goToPrev}
                disabled={!hasPrev}
                className="gap-2"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={goToNext}
                disabled={!hasNext}
                className="gap-2"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </main>

        {/* Right Panel - Checklist */}
        <aside className="hidden xl:block w-96 border-l overflow-auto bg-muted/20">
          <div className="p-4 sticky top-0">
            <GuideSectionChecklist section={section} />
          </div>
        </aside>
      </div>
    );
  };

  return (
    <NavigationProvider
      value={{ currentPage, currentSectionCode, navigateTo }}
    >
      <div className="h-screen flex flex-col bg-background">
        <Header onMenuClick={() => {}} />

        {currentPage === "guide" ? (
          renderPage()
        ) : (
          <div className="flex-1 overflow-auto">
            {renderPage()}
          </div>
        )}

        <Toaster />
      </div>
    </NavigationProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;