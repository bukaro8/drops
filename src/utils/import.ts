import { z } from "zod";
import type { Drop } from "../types";

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const RawDropSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  address: z.string().min(1),
  postcode: z.string().min(1),
  time: z.string().min(1).regex(timeRegex, "Time must be in HH:MM format"),
});

export type RawDropInput = z.input<typeof RawDropSchema>;
export type RawDropOutput = z.output<typeof RawDropSchema>;
export type ValidDrop = RawDropOutput;

export interface ImportResult {
  drops: Drop[];
  importedCount: number;
  skippedCount: number;
  error?: string;
}

export function extractDataParam(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("data");
}

export function parseImportData(raw: string): ImportResult {
  let decoded: unknown;

  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return { drops: [], importedCount: 0, skippedCount: 0, error: "Failed to decode URL parameter" };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(decoded as string);
  } catch {
    return { drops: [], importedCount: 0, skippedCount: 0, error: "Failed to parse JSON" };
  }

  if (!Array.isArray(parsed)) {
    return { drops: [], importedCount: 0, skippedCount: 0, error: "Data must be an array" };
  }

  const validRawDrops: RawDropOutput[] = [];
  let skippedCount = 0;

  for (const item of parsed) {
    const result = RawDropSchema.safeParse(item);
    if (result.success) {
      validRawDrops.push(result.data);
    } else {
      skippedCount++;
    }
  }

  const dedupedById = deduplicateById(validRawDrops);

  const drops: Drop[] = dedupedById.map((raw) => ({
    ...raw,
    done: false,
  }));

  return {
    drops,
    importedCount: drops.length,
    skippedCount,
  };
}

function deduplicateById(drops: RawDropOutput[]): RawDropOutput[] {
  const seen = new Map<string, RawDropOutput>();

  for (let i = drops.length - 1; i >= 0; i--) {
    const drop = drops[i];
    seen.set(drop.id, drop);
  }

  return Array.from(seen.values());
}