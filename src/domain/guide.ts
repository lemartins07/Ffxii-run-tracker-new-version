// Domain types for the FFXII Walkthrough Guide
export type GuideKind = 'story' | 'mark' | 'loot' | 'sidequest' | 'other';

export interface TocEntry {
  code: string;
  order: number;
  kind: GuideKind;
  label: {
    jp?: string;
    en?: string;
    raw: string;
  };
  parentCode?: string;
}

export interface ShopItem {
  itemId: string;
  nameJp?: string;
  nameEn?: string;
  nameRaw: string;
  price?: number;
  type?: string;
}

export interface Shop {
  name: string;         // Weapon Shop, Armor Shop, etc.
  items: ShopItem[];
}

export interface NarrativeBlock {
  kind: 'paragraph';
  text: string;
}

export interface SectionEntry {
  code: string;
  kind: GuideKind | 'other';
  titles: {
    primary: {
      jp?: string;
      en?: string;
      raw: string;
    };
  };
  crystals?: {
    teleport?: boolean;
    save?: boolean;
  };
  shops?: Shop[];
  narrative?: NarrativeBlock[];
}

export interface GuideSectionFull {
  toc: TocEntry;
  entry?: SectionEntry;
  children: TocEntry[]; // marks/loot with parentCode = toc.code
}

export interface WalkthroughMeta {
  title: string;
  author: string;
  version: string;
  lastUpdated: string;
  description?: string;
}

export interface WalkthroughData {
  meta: WalkthroughMeta;
  toc: TocEntry[];
  entries: Record<string, SectionEntry>;
}
