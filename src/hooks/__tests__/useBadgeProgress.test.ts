import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBadgeProgress } from "../useBadgeProgress";

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

describe("useBadgeProgress", () => {
  it("starts with 0 for all modes", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.counts["all"]).toBe(0));
    for (const val of Object.values(result.current.counts)) {
      expect(val).toBe(0);
    }
  });

  it("increment increases the count for the given mode", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.counts["all"]).toBe(0));

    act(() => { result.current.increment("all"); });
    await waitFor(() => expect(result.current.counts["all"]).toBe(1));
  });

  it("increment only affects the target mode", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.counts["all"]).toBe(0));

    act(() => { result.current.increment("europe"); });
    await waitFor(() => expect(result.current.counts["europe"]).toBe(1));
    expect(result.current.counts["africa"]).toBe(0);
    expect(result.current.counts["all"]).toBe(0);
  });

  it("increments accumulate correctly", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.counts["all"]).toBe(0));

    act(() => { result.current.increment("asia"); });
    act(() => { result.current.increment("asia"); });
    act(() => { result.current.increment("asia"); });
    await waitFor(() => expect(result.current.counts["asia"]).toBe(3));
  });

  it("persists count to AsyncStorage", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.counts["all"]).toBe(0));

    act(() => { result.current.increment("all"); });
    await waitFor(async () => {
      const stored = await AsyncStorage.getItem("badge_hc_all");
      expect(stored).toBe("1");
    });
  });

  it("restores persisted counts on remount", async () => {
    const { result: r1 } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(r1.current.counts["all"]).toBe(0));
    act(() => { r1.current.increment("europe"); });
    act(() => { r1.current.increment("europe"); });
    await waitFor(() => expect(r1.current.counts["europe"]).toBe(2));

    const { result: r2 } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(r2.current.counts["europe"]).toBe(2));
  });
});

// ---------------------------------------------------------------------------
// Badge tier thresholds
// ---------------------------------------------------------------------------

describe("Badge tier thresholds", () => {
  const TIERS = {
    all:    [1, 10, 25, 100],
    africa: [1, 5, 10],
    asia:   [1, 5, 10],
    europe: [1, 5, 10],
  };

  const earned = (tiers: number[], count: number) => tiers.filter((t) => count >= t);

  it("'all' mode has four tiers: 1, 10, 25, 100", () => {
    expect(TIERS.all).toEqual([1, 10, 25, 100]);
  });

  it("regional modes have three tiers: 1, 5, 10", () => {
    for (const mode of ["africa", "asia", "europe"] as const) {
      expect(TIERS[mode]).toEqual([1, 5, 10]);
    }
  });

  it("count of 0 earns no badge", () => {
    expect(earned(TIERS.all, 0)).toHaveLength(0);
  });

  it("count of 10 earns first two 'all' badges", () => {
    expect(earned(TIERS.all, 10)).toHaveLength(2);
  });

  it("count of 100 earns all four 'all' badges (legendary)", () => {
    expect(earned(TIERS.all, 100)).toHaveLength(4);
  });
});
