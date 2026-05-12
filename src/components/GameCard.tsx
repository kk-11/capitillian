import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme/colors";

let introPlayed = false;

interface GameCardProps {
  value: string;
  face: "name" | "capital" | "flag";
  isSelected: boolean;
  isWrong: boolean;
  isMatched: boolean;
  isSettled: boolean;
  onPress: () => void;
  disabled?: boolean;
  index?: number;
  columnOffset?: number;
}

export default function GameCard({
  value,
  face,
  isSelected,
  isWrong,
  isMatched,
  isSettled,
  onPress,
  disabled = false,
  index = 0,
  columnOffset = 0,
}: GameCardProps) {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Waterfall fade in on mount
  useEffect(() => {
    const baseDelay = introPlayed ? 0 : 2600;
    const t = setTimeout(() => {
      introPlayed = true;
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }, baseDelay + columnOffset + index * 120);
    return () => clearTimeout(t);
  }, []);

  // Shake on wrong
  useEffect(() => {
    if (!isWrong) return;
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: -10, duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -5,  duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 5,   duration: 55, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 55, useNativeDriver: true }),
    ]).start();
  }, [isWrong]);

  // Green blink then fade out on match
  useEffect(() => {
    if (!isMatched) return;
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 80,  useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1,   duration: 80,  useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0,   duration: 160, useNativeDriver: true }),
    ]).start();
  }, [isMatched]);

  const containerStyle = [
    styles.card,
    isSettled && styles.cardSettled,
    isSelected && styles.cardSelected,
    isWrong    && styles.cardWrong,
    isMatched  && styles.cardMatched,
  ];

  return (
    <Animated.View
      style={[
        styles.cardWrapper,
        { opacity: fadeAnim, transform: [{ translateX: shakeAnim }] },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={onPress}
        disabled={disabled}
        style={containerStyle}
      >
        <View style={styles.inner}>
          {face === "flag" ? (
            <Text style={styles.flagText}>{value}</Text>
          ) : (
            <Text style={styles.labelText} numberOfLines={2} adjustsFontSizeToFit>
              {value}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    opacity: 0,
  },
  card: {
    height: 62,
    borderRadius: 12,
    backgroundColor: "rgba(240, 247, 255, 0.9)",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 22,
    overflow: "hidden",
  },
  cardSelected: {
    backgroundColor: "#B8D4EE",
    borderColor: "#42A8E8",
    borderWidth: 2.5,
  },
  cardWrong: {
    backgroundColor: "#FFEBE8",
    borderColor: "#E53935",
  },
  cardMatched: {
    backgroundColor: "#E8F5E8",
    borderColor: "#388E3C",
  },
  cardSettled: {
    backgroundColor: "#E8F5E8",
    borderColor: "#A5C8A5",
    opacity: 0.55,
  },
  inner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  flagText: {
    fontSize: 40,
    textAlign: "center",
  },
  labelText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
});
