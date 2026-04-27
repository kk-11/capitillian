import { badgeTierState, type TierDef } from "../badgeTierState";

const WORLD_TIERS: TierDef[] = [
  { req: 1   },
  { req: 10  },
  { req: 25  },
  { req: 100, legendary: true },
];

const REGIONAL_TIERS: TierDef[] = [
  { req: 1  },
  { req: 5  },
  { req: 10 },
];

// ---------------------------------------------------------------------------
// Dormant (no wins)
// ---------------------------------------------------------------------------

describe("dormant — no wins", () => {
  it("nothing awakened, count shows easy (0)", () => {
    const s = badgeTierState(0, 0, WORLD_TIERS[0], WORLD_TIERS);
    expect(s.awakened).toBe(false);
    expect(s.hcUnlocked).toBe(false);
    expect(s.easyUnlocked).toBe(false);
    expect(s.displayCount).toBe(0);
    expect(s.label).toBe("0/1");
  });
});

// ---------------------------------------------------------------------------
// Easy track
// ---------------------------------------------------------------------------

describe("easy only", () => {
  it("unlocks tier when easyCount >= req", () => {
    const s = badgeTierState(1, 0, WORLD_TIERS[0], WORLD_TIERS);
    expect(s.easyUnlocked).toBe(true);
    expect(s.awakened).toBe(true);
    expect(s.hcUnlocked).toBe(false);
  });

  it("caps displayCount at req", () => {
    const s = badgeTierState(49, 0, WORLD_TIERS[2], WORLD_TIERS); // req=25
    expect(s.displayCount).toBe(25);
    expect(s.label).toBe("25/25");
  });

  it("shows easy count on legendary when not HC-unlocked", () => {
    const s = badgeTierState(49, 0, WORLD_TIERS[3], WORLD_TIERS); // req=100
    expect(s.displayCount).toBe(49);
    expect(s.label).toBe("49/100");
  });
});

// ---------------------------------------------------------------------------
// HC window — the first tier HC hasn't cleared yet
// ---------------------------------------------------------------------------

describe("HC window", () => {
  it("Master is HC window when hcCount=24 (between Scholar=10 and Master=25)", () => {
    const masterTier = WORLD_TIERS[2]; // req=25
    const s = badgeTierState(49, 24, masterTier, WORLD_TIERS);
    expect(s.isHcWindow).toBe(true);
    expect(s.showHc).toBe(true);
    expect(s.displayCount).toBe(24);
    expect(s.label).toBe("24/25");
  });

  it("Legendary becomes HC window once Master is HC-unlocked (hcCount=26)", () => {
    const legendary = WORLD_TIERS[3]; // req=100
    const s = badgeTierState(49, 26, legendary, WORLD_TIERS);
    expect(s.isHcWindow).toBe(true);
    expect(s.showHc).toBe(true);
    expect(s.displayCount).toBe(26);
    expect(s.label).toBe("26/100");
  });

  it("Master is NOT HC window once hcCount >= 25", () => {
    const masterTier = WORLD_TIERS[2]; // req=25
    const s = badgeTierState(49, 26, masterTier, WORLD_TIERS);
    expect(s.isHcWindow).toBe(false);
    expect(s.hcUnlocked).toBe(true);
  });

  it("only one tier is the HC window at a time", () => {
    const windows = WORLD_TIERS.map(t =>
      badgeTierState(49, 15, t, WORLD_TIERS).isHcWindow
    );
    expect(windows.filter(Boolean)).toHaveLength(1);
  });

  it("no HC window when hcCount is 0", () => {
    const windows = WORLD_TIERS.map(t =>
      badgeTierState(49, 0, t, WORLD_TIERS).isHcWindow
    );
    expect(windows.every(w => !w)).toBe(true);
  });

  it("regional tiers: Scholar is HC window when hcCount=3", () => {
    const scholar = REGIONAL_TIERS[1]; // req=5
    const s = badgeTierState(10, 3, scholar, REGIONAL_TIERS);
    expect(s.isHcWindow).toBe(true);
    expect(s.displayCount).toBe(3);
    expect(s.label).toBe("3/5");
  });
});

// ---------------------------------------------------------------------------
// HC gold (fully unlocked via HC)
// ---------------------------------------------------------------------------

describe("HC unlocked", () => {
  it("hcUnlocked and awakened when hcCount >= req", () => {
    const s = badgeTierState(0, 10, WORLD_TIERS[1], WORLD_TIERS); // Scholar req=10
    expect(s.hcUnlocked).toBe(true);
    expect(s.awakened).toBe(true);
  });

  it("legendary label becomes LEGEND when HC-unlocked", () => {
    const s = badgeTierState(49, 101, WORLD_TIERS[3], WORLD_TIERS); // req=100
    expect(s.hcUnlocked).toBe(true);
    expect(s.label).toBe("LEGEND");
  });

  it("legendary label stays numeric when only easy-unlocked", () => {
    const s = badgeTierState(101, 0, WORLD_TIERS[3], WORLD_TIERS);
    expect(s.label).toBe("100/100");
  });

  it("progress is 1.0 when HC-unlocked", () => {
    const s = badgeTierState(0, 25, WORLD_TIERS[2], WORLD_TIERS);
    expect(s.progress).toBe(1.0);
  });
});
