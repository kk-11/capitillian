import { useEffect, useRef } from "react";
import { AudioPlayer, createAudioPlayer } from "expo-audio";

// Sound file paths — add these to assets/sounds/
const SOUNDS = {
  select:   require("../../assets/sounds/select.mp3"),
  match:    require("../../assets/sounds/match.mp3"),
  wrong:    require("../../assets/sounds/wrong.mp3"),
  complete: require("../../assets/sounds/complete.mp3"),
} as const;

type SoundKey = keyof typeof SOUNDS;

export function useSounds() {
  const players = useRef<Partial<Record<SoundKey, AudioPlayer>>>({});

  useEffect(() => {
    const keys = Object.keys(SOUNDS) as SoundKey[];
    keys.forEach((key) => {
      try {
        players.current[key] = createAudioPlayer(SOUNDS[key]);
      } catch {}
    });
    return () => {
      keys.forEach((key) => {
        try { players.current[key]?.remove(); } catch {}
      });
    };
  }, []);

  const play = (key: SoundKey) => {
    try {
      const player = players.current[key];
      if (!player) return;
      player.seekTo(0);
      player.play();
    } catch {}
  };

  return { play };
}
