import type { Drop, RawDrop } from "../types";

export function mergeDrops(
  existing: Drop[],
  incoming: RawDrop[],
  deletedIds: string[]
): Drop[] {
  const filtered = incoming.filter((drop) => !deletedIds.includes(drop.id));

  const deduped = filtered.reduce<RawDrop[]>((acc, curr) => {
    const existingIndex = acc.findIndex((item) => item.id === curr.id);
    if (existingIndex >= 0) {
      acc[existingIndex] = curr;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  const mergedMap = new Map<string, Drop>();

  for (const drop of existing) {
    if (!deletedIds.includes(drop.id)) {
      mergedMap.set(drop.id, drop);
    }
  }

  for (const drop of deduped) {
    mergedMap.set(drop.id, { ...drop, done: false });
  }

  return Array.from(mergedMap.values());
}