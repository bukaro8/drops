import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import type { Drop } from "../types";
import { loadState, saveState, clearState } from "../utils/storage";
import { extractDataParam, parseImportData } from "../utils/import";

export function useDrops() {
  const [drops, setDrops] = useState<Drop[]>(() => loadState().drops);

  const doneCount = useMemo(() => drops.filter((d) => d.done).length, [drops]);
  const totalCount = useMemo(() => drops.length, [drops]);

  const persist = useCallback((newDrops: Drop[]) => {
    saveState({ version: 1, drops: newDrops });
  }, []);

  const toggleDone = useCallback((id: string) => {
    setDrops((prev) => {
      const updated = prev.map((drop) =>
        drop.id === id ? { ...drop, done: !drop.done } : drop
      );
      persist(updated);
      return updated;
    });
  }, [persist]);

  const deleteDrop = useCallback((id: string) => {
    setDrops((prev) => {
      const updated = prev.filter((drop) => drop.id !== id);
      persist(updated);
      return updated;
    });
  }, [persist]);

  const reorderDrops = useCallback((activeId: string, overId: string) => {
    setDrops((prev) => {
      const oldIndex = prev.findIndex((d) => d.id === activeId);
      const newIndex = prev.findIndex((d) => d.id === overId);

      if (oldIndex === -1 || newIndex === -1) return prev;

      const updated = [...prev];
      const [removed] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, removed);
      persist(updated);
      return updated;
    });
  }, [persist]);

  const clearDrops = useCallback(() => {
    setDrops([]);
    clearState();
  }, []);

  useEffect(() => {
    const dataParam = extractDataParam();
    if (!dataParam) return;

    const result = parseImportData(dataParam);

    if (result.error) {
      toast.error("Invalid route data");
      cleanUrl();
      return;
    }

    if (result.importedCount === 0) {
      toast.error("Invalid route data");
      cleanUrl();
      return;
    }

    setDrops(result.drops);
    persist(result.drops);

    if (result.skippedCount > 0) {
      toast.warning(`${result.importedCount} drops imported, ${result.skippedCount} skipped`);
    } else {
      toast.success(`${result.importedCount} drops imported`);
    }

    cleanUrl();
  }, []);

  return {
    drops,
    doneCount,
    totalCount,
    toggleDone,
    deleteDrop,
    reorderDrops,
    clearDrops,
  };
}

function cleanUrl() {
  window.history.replaceState({}, "", window.location.pathname);
}