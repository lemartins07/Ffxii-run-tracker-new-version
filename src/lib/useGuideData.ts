import { useEffect, useMemo, useState } from 'react';
import type {
  GuideSectionFull,
  SectionEntry,
  TocEntry,
  WalkthroughData,
} from '../domain/guide';

interface GuideDataState {
  data: WalkthroughData | null;
  loading: boolean;
  error: string | null;
}

export function useGuideData() {
  const [state, setState] = useState<GuideDataState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/walkthrough');
        if (!res.ok) {
          throw new Error(
            `Failed to load guide data (${res.status})`,
          );
        }

        const json = (await res.json()) as WalkthroughData;
        if (cancelled) return;

        setState({
          data: json,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (cancelled) return;

        setState({
          data: null,
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : 'Unknown error loading guide data',
        });
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const helpers = useMemo(() => {
    const data = state.data;
    if (!data) {
      return {
        storySections: [] as TocEntry[],
        markSections: [] as TocEntry[],
        lootSections: [] as TocEntry[],
        buildGuideSectionFull: (_code: string): GuideSectionFull | null =>
          null,
      };
    }

    const tocByCode = new Map<string, TocEntry>();
    const entries = new Map<string, SectionEntry>();

    data.toc.forEach((toc) => {
      tocByCode.set(toc.code, toc);
    });

    Object.entries(data.entries).forEach(([code, entry]) => {
      entries.set(code, entry);
    });

    const storySections = data.toc.filter(
      (t) => t.kind === 'story',
    );
    const markSections = data.toc.filter(
      (t) => t.kind === 'mark',
    );
    const lootSections = data.toc.filter(
      (t) => t.kind === 'loot',
    );

    const buildGuideSectionFull = (
      code: string,
    ): GuideSectionFull | null => {
      const toc = tocByCode.get(code);
      if (!toc) return null;

      const entry = entries.get(code);
      const children = data.toc.filter(
        (t) => t.parentCode === code,
      );

      return { toc, entry, children };
    };

    return {
      storySections,
      markSections,
      lootSections,
      buildGuideSectionFull,
    };
  }, [state.data]);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    storySections: helpers.storySections,
    markSections: helpers.markSections,
    lootSections: helpers.lootSections,
    buildGuideSectionFull: helpers.buildGuideSectionFull,
  };
}

