import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePerfectStreak } from "../usePerfectStreak";

const DAY_MS = 24 * 60 * 60 * 1000;

function setDay(offsetDays = 0) {
  // Pin to a fixed Monday so month boundaries don't interfere with "yesterday"
  const base = new Date("2026-01-05T12:00:00Z");
  jest.setSystemTime(new Date(base.getTime() + offsetDays * DAY_MS));
}

beforeEach(async () => {
  jest.useFakeTimers();
  setDay(0);
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
});

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe("initial state", () => {
  it("starts at 0 with empty storage", async () => {
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(0));
  });

  it("loads persisted streak on mount", async () => {
    await AsyncStorage.setItem("perfect_streak_count", "7");
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(7));
  });
});

// ---------------------------------------------------------------------------
// Perfect games (wrongGuesses === 0)
// ---------------------------------------------------------------------------

describe("recordResult — perfect game", () => {
  it("increments streak from 0 to 1 on first perfect game", async () => {
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(0));

    await act(async () => { await result.current.recordResult(0); });
    expect(result.current.streak).toBe(1);
  });

  it("increments streak on consecutive day", async () => {
    await AsyncStorage.setItem("perfect_streak_count", "3");
    await AsyncStorage.setItem("perfect_streak_date", "2026-01-04"); // yesterday
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(3));

    await act(async () => { await result.current.recordResult(0); });
    expect(result.current.streak).toBe(4);
  });

  it("does not double-count a second perfect game on the same day", async () => {
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(0));

    await act(async () => { await result.current.recordResult(0); });
    expect(result.current.streak).toBe(1);

    await act(async () => { await result.current.recordResult(0); });
    expect(result.current.streak).toBe(1); // no change
  });

  it("resets streak to 1 (not accumulates) after a gap of more than 1 day", async () => {
    await AsyncStorage.setItem("perfect_streak_count", "10");
    await AsyncStorage.setItem("perfect_streak_date", "2026-01-01"); // 4 days ago
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(10));

    await act(async () => { await result.current.recordResult(0); });
    expect(result.current.streak).toBe(1); // gap resets to 1, not 11
  });

  it("persists streak and date to AsyncStorage", async () => {
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(0));

    await act(async () => { await result.current.recordResult(0); });

    const stored = await AsyncStorage.getItem("perfect_streak_count");
    const date   = await AsyncStorage.getItem("perfect_streak_date");
    expect(stored).toBe("1");
    expect(date).toBe("2026-01-05");
  });

  it("persists streak across hook remounts", async () => {
    const { result: r1 } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(r1.current.streak).toBe(0));
    await act(async () => { await r1.current.recordResult(0); });
    expect(r1.current.streak).toBe(1);

    const { result: r2 } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(r2.current.streak).toBe(1));
  });
});

// ---------------------------------------------------------------------------
// Imperfect games (wrongGuesses > 0)
// ---------------------------------------------------------------------------

describe("recordResult — imperfect game", () => {
  it("breaks a streak when no perfect game banked today", async () => {
    await AsyncStorage.setItem("perfect_streak_count", "5");
    await AsyncStorage.setItem("perfect_streak_date", "2026-01-04"); // yesterday
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(5));

    await act(async () => { await result.current.recordResult(1); });
    expect(result.current.streak).toBe(0);
  });

  it("does not break streak when a perfect game was already banked today", async () => {
    await AsyncStorage.setItem("perfect_streak_count", "5");
    await AsyncStorage.setItem("perfect_streak_date", "2026-01-05"); // today
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(5));

    await act(async () => { await result.current.recordResult(3); });
    expect(result.current.streak).toBe(5); // protected
  });

  it("streak of 0 stays 0 after imperfect game", async () => {
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(0));

    await act(async () => { await result.current.recordResult(2); });
    expect(result.current.streak).toBe(0);
  });

  it("persists broken streak (0) to AsyncStorage", async () => {
    await AsyncStorage.setItem("perfect_streak_count", "3");
    await AsyncStorage.setItem("perfect_streak_date", "2026-01-04");
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(3));

    await act(async () => { await result.current.recordResult(1); });
    expect(await AsyncStorage.getItem("perfect_streak_count")).toBe("0");
  });
});

// ---------------------------------------------------------------------------
// Multi-day scenarios
// ---------------------------------------------------------------------------

describe("multi-day streak building", () => {
  it("builds streak across consecutive days", async () => {
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(0));

    // Day 0
    await act(async () => { await result.current.recordResult(0); });
    expect(result.current.streak).toBe(1);

    // Day 1
    setDay(1);
    await act(async () => { await result.current.recordResult(0); });
    expect(result.current.streak).toBe(2);

    // Day 2
    setDay(2);
    await act(async () => { await result.current.recordResult(0); });
    expect(result.current.streak).toBe(3);
  });

  it("perfect then imperfect then perfect the next day still increments", async () => {
    const { result } = renderHook(() => usePerfectStreak());
    await waitFor(() => expect(result.current.streak).toBe(0));

    // Day 0: perfect, then imperfect (shouldn't break)
    await act(async () => { await result.current.recordResult(0); });
    await act(async () => { await result.current.recordResult(2); }); // ignored
    expect(result.current.streak).toBe(1);

    // Day 1: perfect — should increment from 1 to 2
    setDay(1);
    await act(async () => { await result.current.recordResult(0); });
    expect(result.current.streak).toBe(2);
  });
});
