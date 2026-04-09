import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Text, View, StyleSheet, Animated } from "react-native";
import { type CardFace, CARD_FACES, FACE_LABELS } from "../game/types";
import { colors } from "../theme/colors";

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
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: colors.textSecondary,
  },
  dots: {
    flexDirection: "row",
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.textSecondary,
  },
});
