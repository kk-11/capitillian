import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { colors } from "../theme/colors";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SpotlightStep {
  key: string;
  title: string;
  body: string;
  rect: Rect;
}

interface SpotlightOnboardingProps {
  visible: boolean;
  steps: SpotlightStep[];
  onDone: () => void;
}

const PAD = 8;
const TOOLTIP_HEIGHT_ESTIMATE = 130;
const MARGIN = 14;

export default function SpotlightOnboarding({ visible, steps, onDone }: SpotlightOnboardingProps) {
  const [index, setIndex] = useState(0);
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const TOOLTIP_WIDTH = Math.min(SCREEN_WIDTH - 48, 300);

  // This component stays mounted permanently (only `visible` toggles), so
  // reset back to the first step every time it's (re)opened.
  useEffect(() => {
    if (visible) setIndex(0);
  }, [visible]);

  if (!visible || steps.length === 0) return null;

  const step = steps[index];
  const isLast = index === steps.length - 1;
  const advance = () => (isLast ? onDone() : setIndex((i) => i + 1));

  const hole = {
    left: step.rect.x - PAD,
    top: step.rect.y - PAD,
    width: step.rect.width + PAD * 2,
    height: step.rect.height + PAD * 2,
  };

  const showBelow = hole.top + hole.height + MARGIN + TOOLTIP_HEIGHT_ESTIMATE < SCREEN_HEIGHT;
  const tooltipTop = showBelow
    ? hole.top + hole.height + MARGIN
    : Math.max(MARGIN, hole.top - MARGIN - TOOLTIP_HEIGHT_ESTIMATE);
  const centerX = hole.left + hole.width / 2;
  const tooltipLeft = Math.min(
    Math.max(centerX - TOOLTIP_WIDTH / 2, 16),
    SCREEN_WIDTH - 16 - TOOLTIP_WIDTH
  );

  return (
    <View style={styles.fill} pointerEvents="box-none">
      {/* Dimmer: top/bottom/left/right strips around the hole, each independently
          tappable-to-advance. Nothing is drawn over the hole itself, so a tap there
          falls through to the real control underneath instead of being captured. */}
      <Pressable onPress={advance} style={[styles.dim, { left: 0, right: 0, top: 0, height: hole.top }]} />
      <Pressable onPress={advance} style={[styles.dim, { left: 0, right: 0, top: hole.top + hole.height, bottom: 0 }]} />
      <Pressable onPress={advance} style={[styles.dim, { left: 0, top: hole.top, width: hole.left, height: hole.height }]} />
      <Pressable onPress={advance} style={[styles.dim, { right: 0, top: hole.top, left: hole.left + hole.width, height: hole.height }]} />

      <View pointerEvents="none" style={[styles.ring, { left: hole.left, top: hole.top, width: hole.width, height: hole.height }]} />

      <View style={[styles.tooltip, { left: tooltipLeft, top: tooltipTop, width: TOOLTIP_WIDTH }]}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.body}>{step.body}</Text>
        <View style={styles.footer}>
          <Pressable onPress={onDone} hitSlop={8}>
            <Text style={styles.skip}>Skip</Text>
          </Pressable>
          <View style={styles.footerRight}>
            <Text style={styles.progress}>{index + 1}/{steps.length}</Text>
            <Pressable onPress={advance} hitSlop={8}>
              <Text style={styles.next}>{isLast ? "Got it" : "Next"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
  },
  dim: {
    position: "absolute",
    backgroundColor: "rgba(4,10,20,0.78)",
  },
  ring: {
    position: "absolute",
    borderWidth: 2,
    borderColor: colors.primary,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "#0A1628",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    color: "rgba(255,255,255,0.75)",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  skip: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
  },
  footerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progress: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
  },
  next: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
});
