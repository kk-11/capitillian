import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import * as Sentry from "@sentry/react-native";
import { PremiumProvider, usePremium } from "../PremiumContext";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("@sentry/react-native", () => ({
  captureException: jest.fn(),
}));

const mockGetCustomerInfo      = jest.fn();
const mockConfigure            = jest.fn();
const mockSetLogLevel          = jest.fn();
const mockGetOfferings         = jest.fn();
const mockPurchasePackage      = jest.fn();
const mockRestorePurchases     = jest.fn();
const mockAddListener          = jest.fn();
const mockRemoveListener       = jest.fn();

jest.mock("react-native-purchases", () => ({
  __esModule: true,
  default: {
    configure:                        (...a: any[]) => mockConfigure(...a),
    setLogLevel:                      (...a: any[]) => mockSetLogLevel(...a),
    getCustomerInfo:                  (...a: any[]) => mockGetCustomerInfo(...a),
    getOfferings:                     (...a: any[]) => mockGetOfferings(...a),
    purchasePackage:                  (...a: any[]) => mockPurchasePackage(...a),
    restorePurchases:                 (...a: any[]) => mockRestorePurchases(...a),
    addCustomerInfoUpdateListener:    (...a: any[]) => mockAddListener(...a),
    removeCustomerInfoUpdateListener: (...a: any[]) => mockRemoveListener(...a),
  },
  LOG_LEVEL: { DEBUG: "DEBUG", ERROR: "ERROR" },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCustomerInfo(isPremium: boolean) {
  return {
    entitlements: {
      active: isPremium ? { "Capitillian Premium": { identifier: "Capitillian Premium" } } : {},
    },
  };
}

const freeCustomerInfo    = makeCustomerInfo(false);
const premiumCustomerInfo = makeCustomerInfo(true);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <PremiumProvider>{children}</PremiumProvider>
);

beforeEach(() => {
  jest.clearAllMocks();
  // Run as production by default so tests reflect real behaviour
  (global as any).__DEV__ = false;
  mockGetCustomerInfo.mockResolvedValue(freeCustomerInfo);
  mockAddListener.mockImplementation(() => {});
  mockRemoveListener.mockImplementation(() => {});
});


// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

describe("PremiumProvider initialisation", () => {
  it("starts initializing=true, isPremium=false", () => {
    const { result } = renderHook(() => usePremium(), { wrapper });
    expect(result.current.initializing).toBe(true);
    expect(result.current.isPremium).toBe(false);
  });

  it("calls Purchases.configure on mount", async () => {
    renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(mockConfigure).toHaveBeenCalledTimes(1));
  });

  it("sets initializing=false after getCustomerInfo resolves", async () => {
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));
  });

  it("isPremium=false when entitlement is not active", async () => {
    mockGetCustomerInfo.mockResolvedValue(freeCustomerInfo);
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));
    expect(result.current.isPremium).toBe(false);
  });

  it("isPremium=true when premium entitlement is active", async () => {
    mockGetCustomerInfo.mockResolvedValue(premiumCustomerInfo);
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.isPremium).toBe(true));
  });

  it("reports error to Sentry and stays free when getCustomerInfo fails", async () => {
    const err = new Error("network error");
    mockGetCustomerInfo.mockRejectedValue(err);
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));
    expect(result.current.isPremium).toBe(false);
    expect(Sentry.captureException).toHaveBeenCalledWith(err, expect.objectContaining({
      extra: { context: "getCustomerInfo" },
    }));
  });
});

// ---------------------------------------------------------------------------
// purchase()
// ---------------------------------------------------------------------------

describe("purchase()", () => {
  const mockPackage = { identifier: "$rc_monthly" };

  beforeEach(() => {
    mockGetOfferings.mockResolvedValue({
      current: { availablePackages: [mockPackage] },
    });
  });

  it("unlocks premium on successful purchase", async () => {
    mockPurchasePackage.mockResolvedValue({ customerInfo: premiumCustomerInfo });
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));

    await act(async () => { await result.current.purchase(); });
    expect(result.current.isPremium).toBe(true);
  });

  it("calls purchasePackage with the first available package", async () => {
    mockPurchasePackage.mockResolvedValue({ customerInfo: premiumCustomerInfo });
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));

    await act(async () => { await result.current.purchase(); });
    expect(mockPurchasePackage).toHaveBeenCalledWith(mockPackage);
  });

  it("throws when no packages are available", async () => {
    mockGetOfferings.mockResolvedValue({ current: { availablePackages: [] } });
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));

    await expect(act(async () => { await result.current.purchase(); }))
      .rejects.toThrow("No packages available");
  });

  it("does not report to Sentry when user cancels", async () => {
    const cancelError = { userCancelled: true, message: "User cancelled" };
    mockPurchasePackage.mockRejectedValue(cancelError);
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));

    await act(async () => {
      try { await result.current.purchase(); } catch {}
    });
    expect(Sentry.captureException).not.toHaveBeenCalledWith(
      cancelError, expect.anything()
    );
  });

  it("reports to Sentry when purchase fails for non-cancel reason", async () => {
    const err = new Error("payment declined");
    mockPurchasePackage.mockRejectedValue(err);
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));

    await act(async () => {
      try { await result.current.purchase(); } catch {}
    });
    expect(Sentry.captureException).toHaveBeenCalledWith(err, expect.objectContaining({
      extra: { context: "purchase" },
    }));
  });

  it("isPremium stays false when purchase is cancelled", async () => {
    mockPurchasePackage.mockRejectedValue({ userCancelled: true });
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));

    await act(async () => {
      try { await result.current.purchase(); } catch {}
    });
    expect(result.current.isPremium).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// restorePurchases()
// ---------------------------------------------------------------------------

describe("restorePurchases()", () => {
  it("returns true and sets isPremium when active entitlement found", async () => {
    mockRestorePurchases.mockResolvedValue(premiumCustomerInfo);
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));

    let restored = false;
    await act(async () => { restored = await result.current.restorePurchases(); });
    expect(restored).toBe(true);
    expect(result.current.isPremium).toBe(true);
  });

  it("returns false when no active entitlement found", async () => {
    mockRestorePurchases.mockResolvedValue(freeCustomerInfo);
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));

    let restored = true;
    await act(async () => { restored = await result.current.restorePurchases(); });
    expect(restored).toBe(false);
    expect(result.current.isPremium).toBe(false);
  });

  it("reports to Sentry and rethrows on failure", async () => {
    const err = new Error("restore failed");
    mockRestorePurchases.mockRejectedValue(err);
    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));

    await expect(act(async () => { await result.current.restorePurchases(); }))
      .rejects.toThrow("restore failed");
    expect(Sentry.captureException).toHaveBeenCalledWith(err, expect.objectContaining({
      extra: { context: "restorePurchases" },
    }));
  });
});

// ---------------------------------------------------------------------------
// Live entitlement updates
// ---------------------------------------------------------------------------

describe("customer info update listener", () => {
  it("updates isPremium when listener fires with premium info", async () => {
    let capturedListener: ((info: any) => void) | null = null;
    mockAddListener.mockImplementation((fn: (info: any) => void) => {
      capturedListener = fn;
    });

    const { result } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(result.current.initializing).toBe(false));
    expect(result.current.isPremium).toBe(false);

    act(() => { capturedListener?.(premiumCustomerInfo); });
    await waitFor(() => expect(result.current.isPremium).toBe(true));
  });

  it("removes listener on unmount", async () => {
    const { unmount } = renderHook(() => usePremium(), { wrapper });
    await waitFor(() => expect(mockAddListener).toHaveBeenCalled());
    unmount();
    expect(mockRemoveListener).toHaveBeenCalled();
  });
});

