import { reducer, INITIAL_STATE, ROUND_SECONDS } from "../useGameEngine";
import type { GameEngineState } from "../useGameEngine";
import { COUNTRIES } from "../../data/countries";

// ---------------------------------------------------------------------------
// Helpers — use real country codes so byCode() lookups work in RESTORE tests
// ---------------------------------------------------------------------------

const C = COUNTRIES.slice(0, 8);

/** Returns a started (ready) state with the given pool */
function startedState(
  pool: Country[] = C,
  overrides: Partial<Parameters<typeof reducer>[1] & { type: "START" }> = {}
): GameEngineState {
  return reducer(INITIAL_STATE, {
    type: "START",
    shuffled: pool,
    targetPairs: pool.length,
    hasTimer: true,
    countUp: false,
    isHardcore: false,
    ...overrides,
  });
}

/** Simulates a correct match of the first paired card on the board */
function matchFirstPair(state: GameEngineState): GameEngineState {
  const code = state.leftCards[0].code;
  let s = reducer(state, { type: "MATCH_START", code });
  s = reducer(s, { type: "MATCH", code });
  return s;
}

// ---------------------------------------------------------------------------
// START action
// ---------------------------------------------------------------------------

describe("START action", () => {
  it("transitions to ready status", () => {
    const s = startedState();
    expect(s.status).toBe("ready");
  });

  it("populates left and right cards (up to BOARD_SIZE)", () => {
    const s = startedState();
    expect(s.leftCards).toHaveLength(5);
    expect(s.rightCards).toHaveLength(5);
  });

  it("left and right cards contain the same codes (different order ok)", () => {
    const s = startedState();
    const leftCodes = s.leftCards.map((c) => c.code).sort();
    const rightCodes = s.rightCards.map((c) => c.code).sort();
    expect(leftCodes).toEqual(rightCodes);
  });

  it("puts remaining countries in the pool", () => {
    const s = startedState(C); // 8 countries, board=5, pool=3
    expect(s.pool).toHaveLength(3);
  });

  it("sets countUp correctly", () => {
    const s = reducer(INITIAL_STATE, {
      type: "START",
      shuffled: C,
      targetPairs: C.length,
      hasTimer: true,
      countUp: true,
      isHardcore: false,
    });
    expect(s.countUp).toBe(true);
    expect(s.secondsLeft).toBe(0); // stopwatch starts at 0
  });

  it("countdown starts at ROUND_SECONDS", () => {
    const s = startedState();
    expect(s.secondsLeft).toBe(ROUND_SECONDS);
  });

  it("resets stats from previous round", () => {
    let s = startedState();
    s = reducer(s, { type: "BEGIN" });
    s = reducer(s, { type: "WRONG", leftIndex: 0, rightIndex: 1 });
    // Start a new game
    s = startedState();
    expect(s.pairsMatched).toBe(0);
    expect(s.wrongGuesses).toBe(0);
    expect(s.wrongCountries).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// BEGIN action
// ---------------------------------------------------------------------------

describe("BEGIN action", () => {
  it("transitions from ready to playing", () => {
    const s = reducer(startedState(), { type: "BEGIN" });
    expect(s.status).toBe("playing");
  });
});

// ---------------------------------------------------------------------------
// SELECT action
// ---------------------------------------------------------------------------

describe("SELECT action", () => {
  it("selects a card", () => {
    let s = reducer(startedState(), { type: "BEGIN" });
    s = reducer(s, { type: "SELECT", side: "left", index: 0 });
    expect(s.selected).toEqual({ side: "left", index: 0 });
  });

  it("deselects when tapping the same card again", () => {
    let s = reducer(startedState(), { type: "BEGIN" });
    s = reducer(s, { type: "SELECT", side: "left", index: 0 });
    s = reducer(s, { type: "SELECT", side: "left", index: 0 });
    expect(s.selected).toBeNull();
  });

  it("replaces selection when tapping same side different index", () => {
    let s = reducer(startedState(), { type: "BEGIN" });
    s = reducer(s, { type: "SELECT", side: "left", index: 0 });
    s = reducer(s, { type: "SELECT", side: "left", index: 1 });
    expect(s.selected).toEqual({ side: "left", index: 1 });
  });
});

// ---------------------------------------------------------------------------
// MATCH action
// ---------------------------------------------------------------------------

describe("MATCH action", () => {
  it("increments pairsMatched", () => {
    const s = matchFirstPair(reducer(startedState(), { type: "BEGIN" }));
    expect(s.pairsMatched).toBe(1);
  });

  it("clears matchFlash after MATCH", () => {
    const s = matchFirstPair(reducer(startedState(), { type: "BEGIN" }));
    expect(s.matchFlash).toBeNull();
  });

  it("status becomes won when all pairs matched", () => {
    // Use exactly 5 countries so pool is empty and one match wins (targetPairs=5)
    const fiveCountries = C.slice(0, 5);
    let s = reducer(INITIAL_STATE, {
      type: "START",
      shuffled: fiveCountries,
      targetPairs: fiveCountries.length,
      hasTimer: true,
      countUp: false,
      isHardcore: false,
    });
    s = reducer(s, { type: "BEGIN" });
    // Match all 5 pairs
    for (const country of fiveCountries) {
      s = reducer(s, { type: "MATCH_START", code: country.code });
      s = reducer(s, { type: "MATCH", code: country.code });
    }
    expect(s.status).toBe("won");
  });

  it("batch-replaces cards from pool after BATCH_SIZE matches", () => {
    // Need enough countries for board (5) + pool (≥3)
    let s = reducer(startedState(), { type: "BEGIN" });
    const initialLeft = [...s.leftCards];
    // Match 3 cards to trigger a batch replacement
    for (let i = 0; i < 3; i++) {
      const code = s.leftCards.find(
        (c) => !s.pendingMatched.includes(c.code)
      )!.code;
      s = reducer(s, { type: "MATCH_START", code });
      s = reducer(s, { type: "MATCH", code });
    }
    // After 3 matches, pendingMatched should be cleared (batch flushed)
    expect(s.pendingMatched).toHaveLength(0);
    // Pool should have shrunk
    expect(s.pool.length).toBeLessThan(startedState().pool.length);
  });
});

// ---------------------------------------------------------------------------
// WRONG action
// ---------------------------------------------------------------------------

describe("WRONG action", () => {
  it("increments wrongGuesses", () => {
    let s = reducer(startedState(), { type: "BEGIN" });
    s = reducer(s, { type: "WRONG", leftIndex: 0, rightIndex: 1 });
    expect(s.wrongGuesses).toBe(1);
  });

  it("sets wrongFlash", () => {
    let s = reducer(startedState(), { type: "BEGIN" });
    s = reducer(s, { type: "WRONG", leftIndex: 0, rightIndex: 1 });
    expect(s.wrongFlash).toEqual({ leftIndex: 0, rightIndex: 1 });
  });

  it("adds involved countries to wrongCountries (deduplicated)", () => {
    let s = reducer(startedState(), { type: "BEGIN" });
    s = reducer(s, { type: "WRONG", leftIndex: 0, rightIndex: 1 });
    s = reducer(s, { type: "CLEAR_WRONG" });
    s = reducer(s, { type: "WRONG", leftIndex: 0, rightIndex: 1 }); // same countries again
    // Should still only have 2 unique entries
    expect(s.wrongCountries).toHaveLength(2);
  });

  it("clears selection", () => {
    let s = reducer(startedState(), { type: "BEGIN" });
    s = reducer(s, { type: "SELECT", side: "left", index: 0 });
    s = reducer(s, { type: "WRONG", leftIndex: 0, rightIndex: 1 });
    expect(s.selected).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// CLEAR_WRONG action
// ---------------------------------------------------------------------------

describe("CLEAR_WRONG action", () => {
  it("clears wrongFlash in normal mode", () => {
    let s = reducer(startedState(), { type: "BEGIN" });
    s = reducer(s, { type: "WRONG", leftIndex: 0, rightIndex: 1 });
    s = reducer(s, { type: "CLEAR_WRONG" });
    expect(s.wrongFlash).toBeNull();
    expect(s.status).toBe("playing");
  });

  it("triggers timeout in hardcore mode", () => {
    let s = reducer(INITIAL_STATE, {
      type: "START",
      shuffled: C,
      targetPairs: C.length,
      hasTimer: true,
      countUp: false,
      isHardcore: true,
    });
    s = reducer(s, { type: "BEGIN" });
    s = reducer(s, { type: "WRONG", leftIndex: 0, rightIndex: 1 });
    s = reducer(s, { type: "CLEAR_WRONG" });
    expect(s.status).toBe("timeout");
  });
});

// ---------------------------------------------------------------------------
// TICK action
// ---------------------------------------------------------------------------

describe("TICK action", () => {
  it("decrements secondsLeft in countdown mode", () => {
    let s = reducer(startedState(), { type: "BEGIN" });
    s = reducer(s, { type: "TICK" });
    expect(s.secondsLeft).toBe(ROUND_SECONDS - 1);
  });

  it("triggers timeout when secondsLeft reaches 0", () => {
    let s = reducer(startedState(), { type: "BEGIN" });
    s = { ...s, secondsLeft: 1 };
    s = reducer(s, { type: "TICK" });
    expect(s.status).toBe("timeout");
    expect(s.secondsLeft).toBe(0);
  });

  it("increments secondsLeft in countUp mode", () => {
    let s = reducer(INITIAL_STATE, {
      type: "START",
      shuffled: C,
      targetPairs: C.length,
      hasTimer: true,
      countUp: true,
      isHardcore: false,
    });
    s = reducer(s, { type: "BEGIN" });
    s = reducer(s, { type: "TICK" });
    expect(s.secondsLeft).toBe(1);
  });

  it("does nothing when hasTimer is false", () => {
    let s = reducer(INITIAL_STATE, {
      type: "START",
      shuffled: C,
      targetPairs: C.length,
      hasTimer: false,
      countUp: false,
      isHardcore: false,
    });
    s = reducer(s, { type: "BEGIN" });
    const before = s.secondsLeft;
    s = reducer(s, { type: "TICK" });
    expect(s.secondsLeft).toBe(before);
  });
});

// ---------------------------------------------------------------------------
// RESTORE action
// ---------------------------------------------------------------------------

describe("RESTORE action", () => {
  it("restores board state with status ready", () => {
    const board = C.slice(0, 5);
    const pool  = C.slice(5, 7);
    const saved = {
      leftCodes: board.map((c) => c.code),
      rightCodes: [...board].reverse().map((c) => c.code),
      poolCodes: pool.map((c) => c.code),
      pendingMatched: [],
      wrongCodes: [],
      pairsMatched: 3,
      wrongGuesses: 1,
      secondsLeft: 180,
      targetPairs: 8,
      hasTimer: true,
      countUp: false,
      isHardcore: false,
    };
    const s = reducer(INITIAL_STATE, { type: "RESTORE", saved });
    expect(s.status).toBe("ready");
    expect(s.pairsMatched).toBe(3);
    expect(s.wrongGuesses).toBe(1);
    expect(s.secondsLeft).toBe(180);
    expect(s.leftCards.map((c) => c.code)).toEqual(board.map((c) => c.code));
  });
});
