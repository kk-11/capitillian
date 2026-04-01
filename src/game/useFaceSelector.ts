import { useState } from "react";
import { CARD_FACES, type CardFace } from "./types";

// Default mode for free users and initial state
const DEFAULT_LEFT: CardFace = "name";
const DEFAULT_RIGHT: CardFace = "capital";

export function useFaceSelector(isPremium: boolean) {
  const [left, setLeft] = useState<CardFace>(DEFAULT_LEFT);
  const [right, setRight] = useState<CardFace>(DEFAULT_RIGHT);

  const cycleLeft = () => {
    if (!isPremium) return;
    const options = CARD_FACES.filter((f) => f !== right);
    const next = options[(options.indexOf(left) + 1) % options.length];
    setLeft(next);
  };

  const cycleRight = () => {
    if (!isPremium) return;
    const options = CARD_FACES.filter((f) => f !== left);
    const next = options[(options.indexOf(right) + 1) % options.length];
    setRight(next);
  };

  return { left, right, cycleLeft, cycleRight };
}
