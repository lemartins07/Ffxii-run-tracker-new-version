"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGuideData } from "@/lib/useGuideData";
import { useChecklistStore } from "@/stores/useChecklistStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { GuideSidebar } from "@/components/GuideSidebar";
import { GuideSectionHeader } from "@/components/GuideSectionHeader";
import { GuideSectionDetailsPanel } from "@/components/GuideSectionDetailsPanel";
import { GuideSectionChecklist } from "@/components/GuideSectionChecklist";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GuideSectionRoute() {
  const params = useParams<{ code: string }>();
  const code = params?.code;

  const {
    loading,
    error,
    storySections,
    buildGuideSectionFull,
  } = useGuideData();

  const currentPlaythroughId = useSettingsStore(
    (state) => state.currentPlaythroughId,
  );
  const getSectionProgress = useChecklistStore(
    (state) => state.getSectionProgress,
  );
  const router = useRouter();

  const section = useMemo(
    () => (code ? buildGuideSectionFull(String(code)) : null),
    [code, buildGuideSectionFull],
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Loading guide data...</p>
      </div>
    );
  }

  if (error || !code) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Failed to load guide data.</p>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Section not found.</p>
      </div>
    );
  }

  const itemIds = [
    `${section.toc.code}:main`,
    ...section.children
      .filter((c) => c.kind === "mark")
      .map((m) => `${m.code}:mark`),
    ...section.children
      .filter((c) => c.kind === "loot")
      .map((l) => `${l.code}:loot`),
  ];

  if (section.entry?.shops && section.entry.shops.length > 0) {
    itemIds.push(`${section.toc.code}:shops`);
  }

  const progress = getSectionProgress(currentPlaythroughId, itemIds);

  const currentIndex = storySections.findIndex(
    (s) => s.code === section.toc.code,
  );
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < storySections.length - 1;

  const goToPrev = () => {
    if (!hasPrev) return;
    const prev = storySections[currentIndex - 1];
    router.push(`/guide/${prev.code}`);
  };

  const goToNext = () => {
    if (!hasNext) return;
    const next = storySections[currentIndex + 1];
    router.push(`/guide/${next.code}`);
  };

  return (
    <div className="flex h-full overflow-hidden">
      <GuideSidebar
        sections={storySections}
        activeCode={section.toc.code}
        className="hidden lg:block w-64 xl:w-72"
      />

      <main className="flex-1 overflow-auto">
        <div className="container max-w-5xl py-6 px-4 lg:px-6 space-y-6">
          <GuideSectionHeader
            section={section}
            progressPercent={progress.percent}
            completedCount={progress.completed}
            totalCount={progress.total}
          />

          <GuideSectionDetailsPanel section={section} />

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

      <aside className="hidden xl:block w-96 border-l overflow-auto bg-muted/20">
        <div className="p-4 sticky top-0">
          <GuideSectionChecklist section={section} />
        </div>
      </aside>
    </div>
  );
}

