import { walkthroughData } from '../data/walkthrough-data';
import type { WalkthroughData, GuideSectionFull, TocEntry, SectionEntry } from '../domain/guide';

// Type-safe import
const data = walkthroughData as WalkthroughData;

// Create lookup maps for fast access
const TOC_BY_CODE = new Map<string, TocEntry>();
const ENTRIES = new Map<string, SectionEntry>();

// Initialize maps
data.toc.forEach(toc => {
  TOC_BY_CODE.set(toc.code, toc);
});

Object.entries(data.entries).forEach(([code, entry]) => {
  ENTRIES.set(code, entry);
});

export function getWalkthroughMeta() {
  return data.meta;
}

export function getAllTocEntries(): TocEntry[] {
  return data.toc;
}

export function getTocEntry(code: string): TocEntry | undefined {
  return TOC_BY_CODE.get(code);
}

export function getSectionEntry(code: string): SectionEntry | undefined {
  return ENTRIES.get(code);
}

export function buildGuideSectionFull(code: string): GuideSectionFull | null {
  const toc = TOC_BY_CODE.get(code);
  if (!toc) return null;

  const entry = ENTRIES.get(code);
  const children = data.toc.filter(t => t.parentCode === code);

  return { toc, entry, children };
}

export function getStorySections(): TocEntry[] {
  return data.toc.filter(t => t.kind === 'story');
}

export function getMarkSections(): TocEntry[] {
  return data.toc.filter(t => t.kind === 'mark');
}

export function getLootSections(): TocEntry[] {
  return data.toc.filter(t => t.kind === 'loot');
}

export function getNextSection(currentCode: string): TocEntry | null {
  const currentToc = TOC_BY_CODE.get(currentCode);
  if (!currentToc) return null;

  const nextOrder = currentToc.order + 1;
  return data.toc.find(t => t.order === nextOrder) || null;
}

export function getPreviousSection(currentCode: string): TocEntry | null {
  const currentToc = TOC_BY_CODE.get(currentCode);
  if (!currentToc) return null;

  const prevOrder = currentToc.order - 1;
  return data.toc.find(t => t.order === prevOrder) || null;
}

// Group sections by story arcs (simplified - you can enhance this)
export function getSectionsByArc() {
  const storySections = getStorySections();
  
  return {
    'Early Game': storySections.slice(0, 3),
    'Mid Game': storySections.slice(3, 7),
    'Late Game': storySections.slice(7),
  };
}