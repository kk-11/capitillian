import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDailyLimit, DAILY_PLAY_LIMIT } from "../useDailyLimit";

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe("useDailyLimit — free user", () => {
  it("starts with 0 plays today", async () => {
    const { result } = renderHook(() => useDailyLimit(false));
    await waitFor(() => expect(result.current.playsToday).toBe(0));
    expect(result.current.hasPlayedToday).toBe(false);
  });

  it("recordPlay increments playsToday", async () => {
    const { result } = renderHook(() => useDailyLimit(false));
    await waitFor(() => expect(result.current.playsToday).toBe(0));

    await act(async () => { await result.current.recordPlay(); });
    expect(result.current.playsToday).toBe(1);
    expect(result.current.hasPlayedToday).toBe(false);
  });

  it(`hasPlayedToday becomes true after ${DAILY_PLAY_LIMIT} plays`, async () => {
    const { result } = renderHook(() => useDailyLimit(false));
    await waitFor(() => expect(result.current.playsToday).toBe(0));

    for (let i = 0; i < DAILY_PLAY_LIMIT; i++) {
      await act(async () => { await result.current.recordPlay(); });
    }
    expect(result.current.playsToday).toBe(DAILY_PLAY_LIMIT);
    expect(result.current.hasPlayedToday).toBe(true);
  });

  it("persists play count across hook remounts", async () => {
    const { result: r1 } = renderHook(() => useDailyLimit(false));
    await waitFor(() => expect(r1.current.playsToday).toBe(0));
    await act(async () => { await r1.current.recordPlay(); });
    await act(async () => { await r1.current.recordPlay(); });

    const { result: r2 } = renderHook(() => useDailyLimit(false));
    await waitFor(() => expect(r2.current.playsToday).toBe(2));
  });

  it("practice tracking works independently from play count", async () => {
    const { result } = renderHook(() => useDailyLimit(false));
    await waitFor(() => expect(result.current.playsToday).toBe(0));

    expect(result.current.hasPracticedToday).toBe(false);
    await act(async () => { await result.current.recordPractice(); });
    expect(result.current.hasPracticedToday).toBe(true);
    expect(result.current.playsToday).toBe(0);
  });
});

describe("useDailyLimit — premium user", () => {
  it("never blocks premium users (hasPlayedToday always false)", () => {
    const { result } = renderHook(() => useDailyLimit(true));
    expect(result.current.hasPlayedToday).toBe(false);
    expect(result.current.playsToday).toBe(0);
  });

  it("recordPlay is a no-op for premium users", async () => {
    const { result } = renderHook(() => useDailyLimit(true));
    await act(async () => { await result.current.recordPlay(); });
    expect(result.current.playsToday).toBe(0);
    expect(await AsyncStorage.getItem("daily_last_played")).toBeNull();
  });

  it("recordPractice is a no-op for premium users", async () => {
    const { result } = renderHook(() => useDailyLimit(true));
    await act(async () => { await result.current.recordPractice(); });
    expect(result.current.hasPracticedToday).toBe(false);
  });
});
