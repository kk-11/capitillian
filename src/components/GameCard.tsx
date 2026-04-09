import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../theme/colors";

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
}: GameCardProps) {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Waterfall fade in on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 220,
      delay: index * 55,
      useNativeDriver: true,
    }).start();
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
      style={{
        opacity: fadeAnim,
        transform: [{ translateX: shakeAnim }],
      }}
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
  card: {
    height: 56,
    borderRadius: 12,
    backgroundColor: "rgba(18, 18, 22, 0.82)",
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 6,
    overflow: "hidden",
  },
  cardSelected: {
    backgroundColor: "#2a2a2a",
    borderColor: colors.primary,
  },
  cardWrong: {
    backgroundColor: "#3a0a0a",
    borderColor: "#ff4444",
  },
  cardMatched: {
    backgroundColor: "#0a2a0a",
    borderColor: "#44cc44",
  },
  cardSettled: {
    backgroundColor: "#0d1a0d",
    borderColor: "#1e3a1e",
    opacity: 0.5,
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
    color: colors.textPrimary,
    textAlign: "center",
  },
});
