import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import Purchases, { type CustomerInfo, LOG_LEVEL } from "react-native-purchases";
import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

// ⚠️  Replace with your RevenueCat iOS API key from app.revenuecat.com
const REVENUECAT_API_KEY = "appl_gNWFDaxhMzXNKrinhvnAbofnlSg";
const ENTITLEMENT_ID = "Capitillian Premium";
const IS_EXPO_GO = __DEV__ && Constants.appOwnership === "expo";

type PremiumContextValue = {
  isPremium: boolean;
  initializing: boolean;
  purchase: () => Promise<void>;
  restorePurchases: () => Promise<boolean>;
};

const PremiumContext = createContext<PremiumContextValue | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const checkPremium = (info: CustomerInfo) => {
    setIsPremium(info.entitlements.active[ENTITLEMENT_ID] !== undefined);
  };

  useEffect(() => {
    Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.ERROR);
    if (IS_EXPO_GO) {
      setInitializing(false);
      return;
    }
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });

    Purchases.getCustomerInfo()
      .then(checkPremium)
      .catch((e) => { Sentry.captureException(e, { extra: { context: "getCustomerInfo" } }); setIsPremium(false); })
      .finally(() => setInitializing(false));

    Purchases.addCustomerInfoUpdateListener(checkPremium);
    return () => Purchases.removeCustomerInfoUpdateListener(checkPremium);
  }, []);

  const purchase = async () => {
    if (IS_EXPO_GO) throw new Error("Purchases unavailable in Expo Go");
    try {
      const offerings = await Purchases.getOfferings();
      const pkg = offerings.current?.availablePackages[0];
      if (!pkg) throw new Error("No packages available");
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      checkPremium(customerInfo);
    } catch (e: any) {
      if (!e?.userCancelled) Sentry.captureException(e, { extra: { context: "purchase" } });
      throw e;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    if (IS_EXPO_GO) throw new Error("Purchases unavailable in Expo Go");
    try {
      const info = await Purchases.restorePurchases();
      const hasPremium = info.entitlements.active[ENTITLEMENT_ID] !== undefined;
      checkPremium(info);
      return hasPremium;
    } catch (e) {
      Sentry.captureException(e, { extra: { context: "restorePurchases" } });
      throw e;
    }
  };

  const value = useMemo<PremiumContextValue>(
    () => ({ isPremium, initializing, purchase, restorePurchases }),
    [isPremium, initializing],
  );

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
}

export function usePremium(): PremiumContextValue {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium must be used within a PremiumProvider");
  return ctx;
}
