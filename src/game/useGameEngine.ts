import { useReducer, useRef, useEffect, useCallback } from "react";
import { COUNTRIES, type Country } from "../data/countries";

export const BOARD_SIZE = 5;
export const BATCH_SIZE = 3;
export const MAX_PAIRS_PER_ROUND = 1000; // cap for large pools
export const ROUND_SECONDS = 300;
export const PRACTICE_PAIRS = 2;

export type GameStatus = "idle" | "ready" | "playing" | "won" | "timeout";

type Selection = { side: "left" | "right"; index: number } | null;
type WrongFlash = { leftIndex: number; rightIndex: number };
type MatchFlash = { code: string };

export type GameEngineState = {
  roundId: number;
  status: GameStatus;
  leftCards: Country[];
  rightCards: Country[];
  selected: Selection;
  wrongFlash: WrongFlash | null;
  matchFlash: MatchFlash | null;
  pendingMatched: string[];
  wrongCountries: Country[];   // deduped countries involved in wrong guesses
  pairsMatched: number;
  wrongGuesses: number;
  secondsLeft: number;   // counts down (free) or up (premium)
  targetPairs: number;
  hasTimer: boolean;
  countUp: boolean;      // true = premium stopwatch, false = free countdown
  isHardcore: boolean;
  pool: Country[];
};

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type Action =
  | { type: "START"; shuffled: Country[]; targetPairs: number; hasTimer: boolean; countUp: boolean; isHardcore: boolean }
  | { type: "BEGIN" }
  | { type: "SELECT"; side: "left" | "right"; index: number }
  | { type: "MATCH_START"; code: string }
  | { type: "MATCH"; code: string }
  | { type: "WRONG"; leftIndex: number; rightIndex: number }
  | { type: "CLEAR_WRONG" }
  | { type: "TICK" };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const INITIAL_STATE: GameEngineState = {
  roundId: 0,
  status: "idle",
  leftCards: [],
  rightCards: [],
  selected: null,
  wrongFlash: null,
  matchFlash: null,
  pendingMatched: [],
  wrongCountries: [],
  pairsMatched: 0,
  wrongGuesses: 0,
  secondsLeft: ROUND_SECONDS,
  targetPairs: MAX_PAIRS_PER_ROUND,
  hasTimer: true,
  countUp: false,
  isHardcore: false,
  pool: [],
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function reducer(state: GameEngineState, action: Action): GameEngineState {
  switch (action.type) {
    case "START": {
      const { shuffled, targetPairs, hasTimer, countUp, isHardcore } = action;
      const size = Math.min(BOARD_SIZE, shuffled.length);
      const boardCountries = shuffled.slice(0, size);
      return {
        ...INITIAL_STATE,
        roundId: state.roundId + 1,
        status: "ready",
        leftCards: boardCountries,
        rightCards: shuffle(boardCountries),
        pool: shuffled.slice(size),
        targetPairs,
        hasTimer,
        countUp,
        isHardcore,
        secondsLeft: countUp ? 0 : ROUND_SECONDS,
      };
    }

    case "BEGIN": {
      return { ...state, status: "playing" };
    }

    case "SELECT": {
      const { side, index } = action;
      const current = state.selected;
      if (current && current.side === side && current.index === index) {
        return { ...state, selected: null };
      }
      return { ...state, selected: { side, index } };
    }

    case "MATCH_START": {
      return {
        ...state,
        selected: null,
        matchFlash: { code: action.code },
      };
    }

    case "MATCH": {
      const newPending = [...state.pendingMatched, action.code];
      const pairsMatched = state.pairsMatched + 1;
      const status: GameStatus = pairsMatched >= state.targetPairs ? "won" : "playing";

      if (newPending.length < BATCH_SIZE && status === "playing") {
        return {
          ...state,
          matchFlash: null,
          pendingMatched: newPending,
          pairsMatched,
          status,
        };
      }

      // Batch: replace matched slots in-place so non-matched cards don't move
      const newLeft = [...state.leftCards];
      const newRight = [...state.rightCards];
      let newPool = [...state.pool];

      const leftSlots = newPending.map((code) => newLeft.findIndex((c) => c.code === code));
      const rightSlots = newPending.map((code) => newRight.findIndex((c) => c.code === code));

      const replacements: Country[] = [];
      for (let i = 0; i < newPending.length && newPool.length > 0; i++) {
        replacements.push(newPool.shift()!);
      }

      leftSlots.forEach((slot, i) => {
        if (slot !== -1 && replacements[i]) newLeft[slot] = replacements[i];
      });

      const shuffledReplacements = shuffle([...replacements]);
      rightSlots.forEach((slot, i) => {
        if (slot !== -1 && shuffledReplacements[i]) newRight[slot] = shuffledReplacements[i];
      });

      return {
        ...state,
        leftCards: newLeft,
        rightCards: newRight,
        pool: newPool,
        matchFlash: null,
        pendingMatched: [],
        pairsMatched,
        status,
      };
    }

    case "WRONG": {
      const { leftIndex, rightIndex } = action;
      const leftCountry = state.leftCards[leftIndex];
      const rightCountry = state.rightCards[rightIndex];
      const existingCodes = new Set(state.wrongCountries.map((c) => c.code));
      const newWrong = [...state.wrongCountries];
      if (leftCountry && !existingCodes.has(leftCountry.code)) newWrong.push(leftCountry);
      if (rightCountry && !existingCodes.has(rightCountry.code)) newWrong.push(rightCountry);
      return {
        ...state,
        selected: null,
        wrongFlash: { leftIndex, rightIndex },
        wrongGuesses: state.wrongGuesses + 1,
        wrongCountries: newWrong,
      };
    }

    case "CLEAR_WRONG": {
      if (state.isHardcore) {
        return { ...state, wrongFlash: null, status: "timeout" };
      }
      return { ...state, wrongFlash: null };
    }

    case "TICK": {
      if (!state.hasTimer) return state;
      if (state.countUp) {
        return { ...state, secondsLeft: state.secondsLeft + 1 };
      }
      const secondsLeft = state.secondsLeft - 1;
      if (secondsLeft <= 0) {
        return { ...state, secondsLeft: 0, status: "timeout" };
      }
      return { ...state, secondsLeft };
    }

    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useGameEngine() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const stateRef = useRef<GameEngineState>(state);
  useEffect(() => {
    stateRef.current = state;
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blockedRef = useRef(false);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);
  }, [stopTimer]);

  useEffect(() => {
    if (state.status === "won" || state.status === "timeout") {
      stopTimer();
    }
  }, [state.status, stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // Prepare the board. Timer only starts when the player taps their first card.
  const startGame = useCallback(
    (pool: Country[] = COUNTRIES, isPremium = false, isPractice = false, isHardcore = false) => {
      stopTimer();
      blockedRef.current = false;
      const shuffled = shuffle(pool);
      dispatch({
        type: "START",
        shuffled,
        // targetPairs: isPractice ? pool.length : (isPremium ? pool.length : PRACTICE_PAIRS),
      targetPairs: 2, // TODO: remove test limit
        hasTimer: true,
        countUp: isPremium && !isPractice,
        isHardcore: isHardcore && !isPractice,
      });
    },
    [stopTimer],
  );

  const selectCard = useCallback((side: "left" | "right", index: number) => {
    const current = stateRef.current;
    if (blockedRef.current) return;
    if (current.status !== "playing" && current.status !== "ready") return;
    if (current.wrongFlash !== null) return;

    // First tap — begin the game and start the timer
    if (current.status === "ready") {
      dispatch({ type: "BEGIN" });
      if (current.hasTimer) startTimer();
    }

    const { selected } = current;

    if (selected === null) {
      dispatch({ type: "SELECT", side, index });
      return;
    }

    if (selected.side === side) {
      dispatch({ type: "SELECT", side, index });
      return;
    }

    const leftIndex = side === "left" ? index : selected.index;
    const rightIndex = side === "right" ? index : selected.index;
    const leftCountry = current.leftCards[leftIndex];
    const rightCountry = current.rightCards[rightIndex];

    if (!leftCountry || !rightCountry) return;
    if (current.pendingMatched.includes(leftCountry.code)) return;
    if (current.pendingMatched.includes(rightCountry.code)) return;

    if (leftCountry.code === rightCountry.code) {
      blockedRef.current = true;
      dispatch({ type: "MATCH_START", code: leftCountry.code });
      setTimeout(() => {
        dispatch({ type: "MATCH", code: leftCountry.code });
        blockedRef.current = false;
      }, 350);
    } else {
      blockedRef.current = true;
      dispatch({ type: "WRONG", leftIndex, rightIndex });
      setTimeout(() => {
        dispatch({ type: "CLEAR_WRONG" });
        blockedRef.current = false;
      }, 700);
    }
  }, [startTimer]);

  return { state, startGame, selectCard };
}
