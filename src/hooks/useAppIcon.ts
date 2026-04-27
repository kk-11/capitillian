import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAlternateAppIcon } from "expo-alternate-app-icons";

const ACTIVE_ICON_KEY = "active_app_icon";

// Icons in ascending prestige order — later entries override earlier ones
// when auto-applying the highest earned icon.
const ICON_TIERS = [
  { name: "match-bronze", track: "easy", req: 7   },
  { name: "match-silver", track: "easy", req: 30  },
  { name: "match-gold",   track: "easy", req: 100 },
  { name: "mine-bronze",  track: "hc",   req: 7   },
  { name: "mine-silver",  track: "hc",   req: 30  },
  { name: "mine-gold",    track: "hc",   req: 100 },
] as const;

type IconName = (typeof ICON_TIERS)[number]["name"] | null;

function totalGames(counts: Partial<Record<string, number>>): number {
  return Object.values(counts).reduce<number>((s, n) => s + (n ?? 0), 0);
}

export function useAppIcon(
  easyCounts: Partial<Record<string, number>>,
  hcCounts:   Partial<Record<string, number>>,
) {
  const [activeIcon,   setActiveIconState] = useState<IconName>(null);
  const [unlockedIcons, setUnlockedIcons]  = useState<Set<string>>(new Set());
  const [newlyUnlocked, setNewlyUnlocked]  = useState<IconName>(null);

  const easyTotal = totalGames(easyCounts);
  const hcTotal   = totalGames(hcCounts);

  // Derive unlocked set from counts
  useEffect(() => {
    const unlocked = new Set<string>();
    for (const tier of ICON_TIERS) {
      const total = tier.track === "easy" ? easyTotal : hcTotal;
      if (total >= tier.req) unlocked.add(tier.name);
    }
    setUnlockedIcons(unlocked);
  }, [easyTotal, hcTotal]);

  // Load persisted active icon on mount
  useEffect(() => {
    AsyncStorage.getItem(ACTIVE_ICON_KEY)
      .then(v => { if (v) setActiveIconState(v as IconName); })
      .catch(() => {});
  }, []);

  // Auto-apply highest newly earned icon
  useEffect(() => {
    if (unlockedIcons.size === 0) return;
    const highest = [...ICON_TIERS].reverse().find(t => unlockedIcons.has(t.name));
    if (!highest) return;
    if (highest.name === activeIcon) return;

    // Only auto-apply and announce if the user hasn't manually picked something higher
    const currentPrestige = ICON_TIERS.findIndex(t => t.name === activeIcon);
    const newPrestige     = ICON_TIERS.findIndex(t => t.name === highest.name);
    if (newPrestige > currentPrestige) {
      applyIcon(highest.name);
      setNewlyUnlocked(highest.name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedIcons]);

  const applyIcon = useCallback(async (name: IconName) => {
    try {
      await setAlternateAppIcon(name);
      setActiveIconState(name);
      await AsyncStorage.setItem(ACTIVE_ICON_KEY, name ?? "");
    } catch {
      // Simulator or entitlement not set — silently ignore
    }
  }, []);

  const dismissNewlyUnlocked = useCallback(() => setNewlyUnlocked(null), []);

  return { activeIcon, unlockedIcons, newlyUnlocked, applyIcon, dismissNewlyUnlocked };
}
