import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

const KEY_STREAK      = "perfect_streak_count";
const KEY_STREAK_DATE = "perfect_streak_date";

function localDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function usePerfectStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(KEY_STREAK);
      setStreak(raw ? parseInt(raw, 10) : 0);
    })();
  }, []);

  // Call this at the end of every non-practice game.
  const recordResult = useCallback(async (wrongGuesses: number) => {
    const today     = localDateStr();
    const yesterday = yesterdayStr();

    const [storedDate, storedCount] = await Promise.all([
      AsyncStorage.getItem(KEY_STREAK_DATE),
      AsyncStorage.getItem(KEY_STREAK),
    ]);
    const current = storedCount ? parseInt(storedCount, 10) : 0;

    if (wrongGuesses === 0) {
      if (storedDate === today) return; // already banked a perfect game today

      const next = storedDate === yesterday ? current + 1 : 1;
      await Promise.all([
        AsyncStorage.setItem(KEY_STREAK, String(next)),
        AsyncStorage.setItem(KEY_STREAK_DATE, today),
      ]);
      setStreak(next);
    } else {
      // Imperfect game — break streak if today not yet saved as perfect
      if (storedDate !== today) {
        await AsyncStorage.setItem(KEY_STREAK, "0");
        setStreak(0);
      }
    }
  }, []);

  return { streak, recordResult };
}
