export type CardFace = "name" | "capital" | "flag";

export const CARD_FACES: CardFace[] = ["name", "capital", "flag"];

export const FACE_LABELS: Record<CardFace, string> = {
  name: "Country",
  capital: "Capital",
  flag: "Flag",
};
