import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { GameMode } from "../data/countries";

const MODES: GameMode[] = [
  "all", "africa", "asia", "europe", "eurasia",
  "north america", "south america", "oceania", "caribbean",
  "landlocked", "island",
];

const easyKey = (mode: GameMode) => `badge_easy_${mode}`;
const hcKey   = (mode: GameMode) => `badge_hc_${mode}`;

async function loadCounts(keyFn: (m: GameMode) => string): Promise<Partial<Record<GameMode, number>>> {
  const pairs = await Promise.all(
    MODES.map(m => AsyncStorage.getItem(keyFn(m)).then(v => [m, v ? parseInt(v, 10) : 0] as const))
  );
  const map: Partial<Record<GameMode, number>> = {};
  pairs.forEach(([m, n]) => { map[m] = n; });
  return map;
}

export function useBadgeProgress() {
  const [easyCounts, setEasyCounts] = useState<Partial<Record<GameMode, number>>>({});
  const [hcCounts,   setHcCounts]   = useState<Partial<Record<GameMode, number>>>({});

  useEffect(() => {
    Promise.all([loadCounts(easyKey), loadCounts(hcKey)])
      .then(([easy, hc]) => { setEasyCounts(easy); setHcCounts(hc); })
      .catch(() => {});
  }, []);

  const incrementEasy = useCallback(async (mode: GameMode) => {
    setEasyCounts(prev => {
      const next = { ...prev, [mode]: (prev[mode] ?? 0) + 1 };
      AsyncStorage.setItem(easyKey(mode), String(next[mode])).catch(() => {});
      return next;
    });
  }, []);

  const incrementHc = useCallback(async (mode: GameMode) => {
    setHcCounts(prev => {
      const next = { ...prev, [mode]: (prev[mode] ?? 0) + 1 };
      AsyncStorage.setItem(hcKey(mode), String(next[mode])).catch(() => {});
      return next;
    });
  }, []);

  return { easyCounts, hcCounts, incrementEasy, incrementHc };
}
