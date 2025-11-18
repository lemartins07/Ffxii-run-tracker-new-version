"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGuideData } from "@/lib/useGuideData";

export default function GuideIndexRoute() {
  const router = useRouter();
  const { loading, error, storySections } = useGuideData();

  useEffect(() => {
    if (loading || error) return;
    if (storySections.length === 0) return;

    const first = storySections[0];
    router.replace(`/guide/${first.code}`);
  }, [loading, error, storySections, router]);

  return (
    <div className="h-full flex items-center justify-center">
      <p>Loading guide...</p>
    </div>
  );
}

