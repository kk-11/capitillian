import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GameMode } from "../data/countries";

const MODES: GameMode[] = [
  "all", "africa", "asia", "europe", "eurasia",
  "north america", "south america", "oceania", "caribbean",
];

const key = (mode: GameMode) => `badge_hc_${mode}`;

export function useBadgeProgress() {
  const [counts, setCounts] = useState<Partial<Record<GameMode, number>>>({});

  useEffect(() => {
    Promise.all(MODES.map(m => AsyncStorage.getItem(key(m)).then(v => [m, v ? parseInt(v, 10) : 0] as const)))
      .then(pairs => {
        const map: Partial<Record<GameMode, number>> = {};
        pairs.forEach(([m, n]) => { map[m] = n; });
        setCounts(map);
      })
      .catch(() => {});
  }, []);

  const increment = useCallback(async (mode: GameMode) => {
    setCounts(prev => {
      const next = { ...prev, [mode]: (prev[mode] ?? 0) + 1 };
      AsyncStorage.setItem(key(mode), String(next[mode])).catch(() => {});
      return next;
    });
  }, []);

  return { counts, increment };
}
