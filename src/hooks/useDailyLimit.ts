import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

const KEY_PLAYED   = "daily_last_played";
const KEY_PRACTICE = "daily_practice_used";

// Local calendar date, so the reset is at the user's local midnight.
function localDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function secsUntilLocalMidnight(): number {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return Math.ceil((midnight.getTime() - now.getTime()) / 1000);
}

export function useDailyLimit(isPremium: boolean) {
  const [hasPlayedToday,    setHasPlayedToday]    = useState(false);
  const [hasPracticedToday, setHasPracticedToday] = useState(false);
  const [secondsLeft,       setSecondsLeft]       = useState(secsUntilLocalMidnight());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    if (isPremium) return;
    (async () => {
      const today = localDateStr();
      const [played, practiced] = await Promise.all([
        AsyncStorage.getItem(KEY_PLAYED),
        AsyncStorage.getItem(KEY_PRACTICE),
      ]);
      setHasPlayedToday(played === today);
      setHasPracticedToday(practiced === today);
    })();
  }, [isPremium]);

  // Countdown ticker — only runs when a free user has used their daily game
  useEffect(() => {
    if (isPremium || !hasPlayedToday) {
      if (tickRef.current) clearInterval(tickRef.current);
      return;
    }
    setSecondsLeft(secsUntilLocalMidnight());
    tickRef.current = setInterval(() => {
      const secs = secsUntilLocalMidnight();
      setSecondsLeft(secs);
      if (secs <= 0) {
        // New day — reset
        setHasPlayedToday(false);
        setHasPracticedToday(false);
        clearInterval(tickRef.current!);
      }
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [isPremium, hasPlayedToday]);

  const recordPlay = useCallback(async () => {
    if (isPremium) return;
    await AsyncStorage.setItem(KEY_PLAYED, localDateStr());
    setHasPlayedToday(true);
    setSecondsLeft(secsUntilLocalMidnight());
  }, [isPremium]);

  const recordPractice = useCallback(async () => {
    if (isPremium) return;
    await AsyncStorage.setItem(KEY_PRACTICE, localDateStr());
    setHasPracticedToday(true);
  }, [isPremium]);

  return { hasPlayedToday, hasPracticedToday, secondsLeft, recordPlay, recordPractice };
}
