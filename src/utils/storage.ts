import type { Drop, StoredState } from "../types";

const STORAGE_KEY = "drops_app_state";
const DEFAULT_STATE: StoredState = { version: 1, drops: [] };

export function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;

    const parsed = JSON.parse(raw);

    if (!isValidStoredState(parsed)) {
      return DEFAULT_STATE;
    }

    return parsed;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: StoredState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Silently fail - app continues in-memory
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently fail
  }
}

function isValidStoredState(value: unknown): value is StoredState {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  if (obj.version !== 1) return false;
  if (!Array.isArray(obj.drops)) return false;

  return obj.drops.every(isValidDrop);
}

function isValidDrop(value: unknown): value is Drop {
  if (typeof value !== "object" || value === null) return false;

  const drop = value as Record<string, unknown>;

  return (
    typeof drop.id === "string" &&
    typeof drop.name === "string" &&
    typeof drop.address === "string" &&
    typeof drop.postcode === "string" &&
    typeof drop.time === "string" &&
    typeof drop.done === "boolean"
  );
}

export { DEFAULT_STATE };