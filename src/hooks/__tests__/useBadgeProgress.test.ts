import { renderHook, act, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useBadgeProgress } from "../useBadgeProgress";

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

describe("initial state", () => {
  it("starts with 0 for all modes on both tracks", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.easyCounts["all"]).toBe(0));
    for (const val of Object.values(result.current.easyCounts)) expect(val).toBe(0);
    for (const val of Object.values(result.current.hcCounts))   expect(val).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Easy track
// ---------------------------------------------------------------------------

describe("incrementEasy", () => {
  it("increments easyCounts for the target mode", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.easyCounts["all"]).toBe(0));

    act(() => { result.current.incrementEasy("all"); });
    await waitFor(() => expect(result.current.easyCounts["all"]).toBe(1));
  });

  it("does not affect hcCounts", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.easyCounts["all"]).toBe(0));

    act(() => { result.current.incrementEasy("europe"); });
    await waitFor(() => expect(result.current.easyCounts["europe"]).toBe(1));
    expect(result.current.hcCounts["europe"]).toBe(0);
  });

  it("persists to badge_easy_ key in AsyncStorage", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.easyCounts["all"]).toBe(0));

    act(() => { result.current.incrementEasy("all"); });
    await waitFor(async () => {
      expect(await AsyncStorage.getItem("badge_easy_all")).toBe("1");
    });
    expect(await AsyncStorage.getItem("badge_hc_all")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Hardcore track
// ---------------------------------------------------------------------------

describe("incrementHc", () => {
  it("increments hcCounts for the target mode", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.hcCounts["all"]).toBe(0));

    act(() => { result.current.incrementHc("all"); });
    await waitFor(() => expect(result.current.hcCounts["all"]).toBe(1));
  });

  it("does not affect easyCounts", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.hcCounts["all"]).toBe(0));

    act(() => { result.current.incrementHc("africa"); });
    await waitFor(() => expect(result.current.hcCounts["africa"]).toBe(1));
    expect(result.current.easyCounts["africa"]).toBe(0);
  });

  it("persists to badge_hc_ key in AsyncStorage", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.hcCounts["all"]).toBe(0));

    act(() => { result.current.incrementHc("all"); });
    await waitFor(async () => {
      expect(await AsyncStorage.getItem("badge_hc_all")).toBe("1");
    });
    expect(await AsyncStorage.getItem("badge_easy_all")).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Dual-track independence
// ---------------------------------------------------------------------------

describe("dual-track independence", () => {
  it("easy and hc counts accumulate independently on the same mode", async () => {
    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.easyCounts["all"]).toBe(0));

    act(() => { result.current.incrementEasy("all"); });
    act(() => { result.current.incrementEasy("all"); });
    act(() => { result.current.incrementHc("all"); });
    await waitFor(() => expect(result.current.easyCounts["all"]).toBe(2));
    expect(result.current.hcCounts["all"]).toBe(1);
  });

  it("restores both tracks from AsyncStorage on remount", async () => {
    await AsyncStorage.setItem("badge_easy_asia", "4");
    await AsyncStorage.setItem("badge_hc_asia",   "2");

    const { result } = renderHook(() => useBadgeProgress());
    await waitFor(() => expect(result.current.easyCounts["asia"]).toBe(4));
    expect(result.current.hcCounts["asia"]).toBe(2);
  });
});
