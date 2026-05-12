import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Animated, Platform } from "react-native";
import { type CardFace, CARD_FACES, FACE_LABELS } from "../game/types";
import { colors } from "../theme/colors";

const isTablet = Platform.isPad;

interface FaceHeaderProps {
  face: CardFace;
  isPremium?: boolean;
  onPress: () => void;
}

export default function FaceHeader({ face, onPress }: FaceHeaderProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity }}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.6}
      >
        <Text style={styles.label}>{FACE_LABELS[face]}</Text>
        <View style={styles.dots}>
          {CARD_FACES.map((f) => (
            <View key={f} style={[styles.dot, f === face && styles.dotActive]} />
          ))}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 10,
    gap: 6,
  },
  label: {
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: isTablet ? "#FFFFFF" : colors.textPrimary,
    ...(isTablet ? {
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    } : {}),
  },
  dots: {
    flexDirection: "row",
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: isTablet ? "rgba(255,255,255,0.45)" : colors.border,
  },
  dotActive: {
    backgroundColor: isTablet ? "rgba(255,255,255,0.95)" : colors.textSecondary,
  },
});
