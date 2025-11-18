"use client";

import { AboutPage } from "@/components/AboutPage";
import { useGuideData } from "@/lib/useGuideData";

export default function AboutRoute() {
  const { loading, error, data } = useGuideData();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Loading guide data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-full flex items-center justify-center">
        <p>Failed to load guide data.</p>
      </div>
    );
  }

  return <AboutPage meta={data.meta} />;
}

