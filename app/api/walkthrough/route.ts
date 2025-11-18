import { NextResponse } from 'next/server';
import rawData from '@/data/data.json';
import type { WalkthroughData } from '@/domain/guide';

function parseChangelogDate(dateStr: string): string {
  const parts = dateStr.split('/');
  if (parts.length !== 3) {
    return new Date().toISOString();
  }

  const [monthStr, dayStr, yearStr] = parts;
  const month = Number(monthStr);
  const day = Number(dayStr);
  const year =
    yearStr.length === 2 ? Number(`20${yearStr}`) : Number(yearStr);

  if (!month || !day || !year) {
    return new Date().toISOString();
  }

  const date = new Date(year, month - 1, day);
  return date.toISOString();
}

function buildWalkthroughData(): WalkthroughData {
  const meta = (rawData as any).meta || {};
  const changelog = Array.isArray(meta.changelog)
    ? meta.changelog
    : [];
  const lastEntry =
    changelog.length > 0 ? changelog[changelog.length - 1] : null;

  const lastUpdated = lastEntry?.date
    ? parseChangelogDate(lastEntry.date)
    : new Date().toISOString();

  const normalizedMeta = {
    title: meta.title ?? '',
    author: meta.author ?? '',
    version: meta.version ?? '',
    lastUpdated,
    description: meta.subtitle,
  };

  return {
    ...(rawData as any),
    meta: normalizedMeta,
  } as WalkthroughData;
}

export function GET() {
  const data = buildWalkthroughData();
  return NextResponse.json(data);
}

