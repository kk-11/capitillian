import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useRef, useState } from "react";

const KEY_PLAYED   = "daily_last_played";
const KEY_PRACTICE = "daily_practice_used";
export const DAILY_PLAY_LIMIT = 3;

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

// Stored as "YYYY-MM-DD:N" — count of plays on that date.
function parsePlayed(raw: string | null): number {
  if (!raw) return 0;
  const [date, countStr] = raw.split(":");
  if (date !== localDateStr()) return 0;
  return parseInt(countStr ?? "0", 10);
}

function serializePlayed(count: number): string {
  return `${localDateStr()}:${count}`;
}

export function useDailyLimit(isPremium: boolean) {
  const [playsToday,        setPlaysToday]        = useState(0);
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
      setPlaysToday(parsePlayed(played));
      setHasPracticedToday(practiced === today);
    })();
  }, [isPremium]);

  const hasPlayedToday = playsToday >= DAILY_PLAY_LIMIT;

  // Countdown ticker — only runs when a free user has hit their limit
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
        setPlaysToday(0);
        setHasPracticedToday(false);
        clearInterval(tickRef.current!);
      }
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [isPremium, hasPlayedToday]);

  const recordPlay = useCallback(async () => {
    if (isPremium) return;
    const next = playsToday + 1;
    await AsyncStorage.setItem(KEY_PLAYED, serializePlayed(next));
    setPlaysToday(next);
    if (next >= DAILY_PLAY_LIMIT) setSecondsLeft(secsUntilLocalMidnight());
  }, [isPremium, playsToday]);

  const recordPractice = useCallback(async () => {
    if (isPremium) return;
    await AsyncStorage.setItem(KEY_PRACTICE, localDateStr());
    setHasPracticedToday(true);
  }, [isPremium]);

  return { playsToday, hasPlayedToday, hasPracticedToday, secondsLeft, recordPlay, recordPractice };
}
