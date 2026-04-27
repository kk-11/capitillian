export type TierDef = { req: number; legendary?: boolean };

export type BadgeTierState = {
  hcUnlocked: boolean;
  easyUnlocked: boolean;
  awakened: boolean;
  isHcWindow: boolean;
  showHc: boolean;
  displayCount: number;
  progress: number;
  label: string;
};

export function badgeTierState(
  easyCount: number,
  hcCount: number,
  tier: TierDef,
  tiers: TierDef[],
): BadgeTierState {
  const { req, legendary = false } = tier;
  const hcUnlocked  = hcCount >= req;
  const easyUnlocked = easyCount >= req;
  const awakened    = hcUnlocked || easyUnlocked;
  const isHcWindow  =
    hcCount > 0 &&
    hcCount < req &&
    tiers.findIndex(t => hcCount < t.req) === tiers.findIndex(t => t.req === req);
  const showHc      = isHcWindow || hcUnlocked;
  const displayCount = Math.min(showHc ? hcCount : easyCount, req);
  const progress    = displayCount / req;
  const label       = hcUnlocked && legendary ? "LEGEND" : `${displayCount}/${req}`;

  return { hcUnlocked, easyUnlocked, awakened, isHcWindow, showHc, displayCount, progress, label };
}
