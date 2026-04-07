import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import Purchases, { type CustomerInfo, LOG_LEVEL } from "react-native-purchases";

// ⚠️  Replace with your RevenueCat iOS API key from app.revenuecat.com
const REVENUECAT_API_KEY = "appl_gNWFDaxhMzXNKrinhvnAbofnlSg";
const ENTITLEMENT_ID = "premium";

type PremiumContextValue = {
  isPremium: boolean;
  initializing: boolean;
  purchase: () => Promise<void>;
  restorePurchases: () => Promise<boolean>;
};

const PremiumContext = createContext<PremiumContextValue | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(true);
  const [initializing, setInitializing] = useState(true);

  const checkPremium = (info: CustomerInfo) => {
    setIsPremium(true);
  };

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });

    Purchases.getCustomerInfo()
      .then(checkPremium)
      .catch(() => setIsPremium(false))
      .finally(() => setInitializing(false));

    Purchases.addCustomerInfoUpdateListener(checkPremium);
    return () => Purchases.removeCustomerInfoUpdateListener(checkPremium);
  }, []);

  const purchase = async () => {
    const offerings = await Purchases.getOfferings();
    const pkg = offerings.current?.availablePackages[0];
    if (!pkg) throw new Error("No packages available");
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    checkPremium(customerInfo);
  };

  const restorePurchases = async (): Promise<boolean> => {
    const info = await Purchases.restorePurchases();
    const hasPremium = info.entitlements.active[ENTITLEMENT_ID] !== undefined;
    checkPremium(info);
    return hasPremium;
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
