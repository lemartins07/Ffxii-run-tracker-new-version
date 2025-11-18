"use client";

import { HuntsPage } from "@/components/HuntsPage";
import { useGuideData } from "@/lib/useGuideData";

export default function HuntsRoute() {
  const { loading, error, markSections, buildGuideSectionFull } =
    useGuideData();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Loading guide data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Failed to load guide data.</p>
      </div>
    );
  }

  return (
    <HuntsPage
      markSections={markSections}
      buildGuideSectionFull={buildGuideSectionFull}
    />
  );
}

