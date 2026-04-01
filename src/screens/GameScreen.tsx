import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { useFaceSelector } from "../game/useFaceSelector";
import { useGameEngine, ROUND_SECONDS } from "../game/useGameEngine";
import { useDailyLimit } from "../hooks/useDailyLimit";
import { usePerfectStreak } from "../hooks/usePerfectStreak";
import FaceHeader from "../components/FaceHeader";
import GameCard from "../components/GameCard";
import Globe from "../components/Globe";
import HardcoreVignette from "../components/HardcoreVignette";
import PremiumDialog from "../components/PremiumDialog";
import { getFaceValue, REGIONS, MODE_LABELS, type GameMode } from "../data/countries";
import { colors } from "../theme/colors";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatCountdown(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function GameScreen() {
  const { isPremium } = useAuth();
  const { left, right, cycleLeft, cycleRight } = useFaceSelector(isPremium);
  const { state, startGame, selectCard } = useGameEngine();
  const { hasPlayedToday, hasPracticedToday, secondsLeft: countdownSecs, recordPlay, recordPractice } = useDailyLimit(isPremium);
  const { streak: perfectStreak, recordResult: recordStreakResult } = usePerfectStreak();
  const [gameMode, setGameMode] = useState<GameMode>("all");
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [isHardcore, setIsHardcore] = useState(false);
  const [globeFrame, setGlobeFrame] = useState(0);
  const GLOBE_FRAMES = ["🌍", "🌎", "🌏"];
  useEffect(() => {
    const id = setInterval(() => setGlobeFrame(f => (f + 1) % 3), 400);
    return () => clearInterval(id);
  }, []);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  // Track game-just-finished synchronously so the countdown appears immediately
  // without waiting for the async AsyncStorage write in recordPlay.
  const [gameEndedAsFree, setGameEndedAsFree] = useState(false);
  const recordedRef = useRef(false);

  useEffect(() => {
    startGame(REGIONS[gameMode], isPremium, false, isHardcore);
  }, []);

  // Record daily play + perfect streak when a non-practice game ends.
  useEffect(() => {
    const ended = state.status === "won" || state.status === "timeout";
    if (ended && !state.countUp && !recordedRef.current) {
      // practice games have no timer and no countUp — exclude them via hasTimer
    }
    if (ended && !recordedRef.current) {
      recordedRef.current = true;
      // Only record streak for real (non-practice) games
      if (state.hasTimer) {
        recordStreakResult(state.wrongGuesses);
      }
      if (!isPremium && state.hasTimer) {
        setGameEndedAsFree(true);
        recordPlay();
      }
    }
    if (state.status === "ready" || state.status === "idle") {
      recordedRef.current = false;
      setGameEndedAsFree(false);
    }
  }, [state.status, state.hasTimer, state.wrongGuesses, isPremium]);

  const {
    roundId,
    status,
    leftCards,
    rightCards,
    selected,
    wrongFlash,
    matchFlash,
    pendingMatched,
    wrongCountries,
    pairsMatched,
    wrongGuesses,
    secondsLeft,
    targetPairs,
    hasTimer,
    countUp,
  } = state;

  const timerColor =
    !countUp && secondsLeft < 60 ? styles.timerRed : styles.timerDefault;

  const timeTaken = countUp ? secondsLeft : ROUND_SECONDS - secondsLeft;
  const isDisabled = wrongFlash !== null || matchFlash !== null;

  // Freemium gate flags
  const showCountdown  = !isPremium && (hasPlayedToday || gameEndedAsFree);
  const canPlayAgain   = isPremium;
  const canPractice    = wrongCountries.length > 1 && (isPremium || !hasPracticedToday);

  return (
    <View style={styles.container}>
      <Globe />
      {isHardcore && <HardcoreVignette />}
      <Text style={styles.branding} pointerEvents="none">{GLOBE_FRAMES[globeFrame]} capitillian</Text>
      <SafeAreaView style={styles.safe}>
      {/* ------------------------------------------------------------------ */}
      {/* Top bar: timer + progress                                           */}
      {/* ------------------------------------------------------------------ */}
      <View style={styles.topBar}>
        {hasTimer ? (
          <Text style={[styles.timer, timerColor]}>{formatTime(secondsLeft)}</Text>
        ) : (
          <Text style={styles.practiceLabel}>PRACTICE</Text>
        )}
        <View style={styles.topRight}>
          <TouchableOpacity
            style={styles.hardcoreToggle}
            onPress={() => {
              const next = !isHardcore;
              setIsHardcore(next);
              startGame(REGIONS[gameMode], isPremium, false, next);
            }}
            activeOpacity={0.7}
            disabled={status === "playing"}
          >
            <Text style={[styles.hardcoreLabel, isHardcore && styles.hardcoreLabelActive, status === "playing" && styles.controlsLocked]}>
              {isHardcore ? "💔 HARDCORE" : "EASY"}
            </Text>
            <View style={styles.hardcoreDots}>
              <View style={[styles.hardcoreDot, !isHardcore && styles.hardcoreDotActive]} />
              <View style={[styles.hardcoreDot,  isHardcore && styles.hardcoreDotActive]} />
            </View>
          </TouchableOpacity>
          {isPremium ? (
            <TouchableOpacity
              onPress={() => setShowModeDropdown(true)}
              activeOpacity={0.7}
              disabled={status === "playing"}
            >
              <Text style={[styles.modeLabel, status === "playing" && styles.controlsLocked]}>
                {MODE_LABELS[gameMode]}
              </Text>
            </TouchableOpacity>
          ) : null}
          <Text style={styles.progress}>{pairsMatched} / {targetPairs}</Text>
        </View>
      </View>

      {/* Mode dropdown */}
      <Modal visible={showModeDropdown} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowModeDropdown(false)}>
          <View style={styles.dropdownBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                {(Object.keys(MODE_LABELS) as GameMode[]).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={styles.dropdownRow}
                    onPress={() => {
                      setGameMode(mode);
                      setShowModeDropdown(false);
                      startGame(REGIONS[mode], isPremium, false, isHardcore);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dropdownItem, mode === gameMode && styles.dropdownItemActive]}>
                      {MODE_LABELS[mode]}
                    </Text>
                    {mode === gameMode && <Text style={styles.dropdownCheck}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ------------------------------------------------------------------ */}
      {/* Main board                                                          */}
      {/* ------------------------------------------------------------------ */}
      <View style={styles.board}>
        <ScrollView
          style={styles.cardsScroll}
          contentContainerStyle={styles.cardsContent}
          scrollEnabled={false}
        >
          <View style={styles.cardsRow}>
            {/* Left column */}
            <View style={styles.column}>
              <FaceHeader face={left} isPremium={isPremium} onPress={cycleLeft} />
              {leftCards.map((card, i) => (
                <GameCard
                  key={`left-${roundId}-${card.code}`}
                  value={getFaceValue(card, left)}
                  face={left}
                  isSelected={
                    selected?.side === "left" && selected?.index === i
                  }
                  isWrong={wrongFlash?.leftIndex === i}
                  isMatched={matchFlash?.code === card.code}
                  isSettled={pendingMatched.includes(card.code)}
                  onPress={() => selectCard("left", i)}
                  disabled={isDisabled || pendingMatched.includes(card.code)}
                />
              ))}
            </View>

            <View style={styles.divider} />

            {/* Right column */}
            <View style={styles.column}>
              <FaceHeader face={right} isPremium={isPremium} onPress={cycleRight} />
              {rightCards.map((card, i) => (
                <GameCard
                  key={`right-${roundId}-${card.code}`}
                  value={getFaceValue(card, right)}
                  face={right}
                  isSelected={
                    selected?.side === "right" && selected?.index === i
                  }
                  isWrong={wrongFlash?.rightIndex === i}
                  isMatched={matchFlash?.code === card.code}
                  isSettled={pendingMatched.includes(card.code)}
                  onPress={() => selectCard("right", i)}
                  disabled={isDisabled || pendingMatched.includes(card.code)}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* ------------------------------------------------------------------ */}
      {/* End overlay — won or timeout                                        */}
      {/* ------------------------------------------------------------------ */}
      {(status === "won" || status === "timeout") && (
        <View style={styles.overlay}>
          <ScrollView
            style={styles.endScroll}
            contentContainerStyle={styles.endScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            {status === "won" ? (
              <Text style={styles.endTitle}>Round Complete! 🎉</Text>
            ) : (
              <Text style={styles.endTitle}>Time's Up!</Text>
            )}

            {/* Stats */}
            <View style={styles.statsBlock}>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Pairs matched</Text>
                <Text style={styles.statValue}>{pairsMatched} / {targetPairs}</Text>
              </View>
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Wrong guesses</Text>
                <Text style={styles.statValue}>{wrongGuesses}</Text>
              </View>
              {hasTimer && (
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Time taken</Text>
                  <Text style={styles.statValue}>{formatTime(timeTaken)}</Text>
                </View>
              )}
              <View style={styles.statRow}>
                <Text style={styles.statLabel}>Perfect streak</Text>
                <Text style={styles.statValue}>
                  {perfectStreak} {perfectStreak === 1 ? "day" : "days"}
                </Text>
              </View>
            </View>

            {/* Actions — premium vs free */}
            {canPlayAgain ? (
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => { startGame(REGIONS[gameMode], isPremium, false, isHardcore); }}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>
                  {status === "won" ? "Play Again" : "Try Again"}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.countdownBlock}>
                <Text style={styles.countdownLabel}>Next game in</Text>
                <Text style={styles.countdownValue}>
                  {formatCountdown(showCountdown ? countdownSecs : 0)}
                </Text>
              </View>
            )}

            {canPractice && (
              <TouchableOpacity
                style={styles.practiceButton}
                onPress={() => {
                  setExpandedCode(null);
                  if (!isPremium) recordPractice();
                  startGame(wrongCountries, isPremium, true);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.practiceButtonText}>
                  Practice {wrongCountries.length} Wrong Answers
                </Text>
              </TouchableOpacity>
            )}

            {/* Upsell CTA for free users */}
            {!isPremium && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => setShowPremiumDialog(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.upgradeText}>✦ Unlock Unlimited — €5</Text>
              </TouchableOpacity>
            )}

            {/* Wrong answers list */}
            {wrongCountries.length > 0 && (
              <View style={styles.wrongSection}>
                <Text style={styles.wrongSectionTitle}>
                  Wrong Answers ({wrongCountries.length})
                </Text>
                {wrongCountries.map((country) => {
                  const expanded = expandedCode === country.code;
                  return (
                    <TouchableOpacity
                      key={country.code}
                      style={[styles.wrongItem, expanded && styles.wrongItemExpanded]}
                      onPress={() => setExpandedCode(expanded ? null : country.code)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.wrongItemRow}>
                        <Text style={styles.wrongItemFlag}>{country.flag}</Text>
                        <View style={styles.wrongItemText}>
                          <Text style={styles.wrongItemName}>{country.name}</Text>
                          <Text style={styles.wrongItemCapital}>{country.capital}</Text>
                        </View>
                        <Text style={styles.wrongItemChevron}>{expanded ? "▲" : "▼"}</Text>
                      </View>
                      {expanded && (
                        <View style={styles.wrongItemDetail}>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Capital</Text>
                            <Text style={styles.detailValue}>{country.capital}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Continent</Text>
                            <Text style={styles.detailValue}>{country.continent}</Text>
                          </View>
                          <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Code</Text>
                            <Text style={styles.detailValue}>{country.code}</Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>

    <PremiumDialog
      visible={showPremiumDialog}
      onDismiss={() => setShowPremiumDialog(false)}
      onPurchase={() => {
        // TODO: wire to expo-in-app-purchases or RevenueCat
        setShowPremiumDialog(false);
      }}
    />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timer: {
    fontSize: 22,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  timerDefault: {
    color: colors.textPrimary,
  },
  timerRed: {
    color: colors.error,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modeLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textSecondary,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    letterSpacing: 0.3,
  },
  progress: {
    fontSize: 16,
    color: colors.textSecondary,
    fontVariant: ["tabular-nums"],
  },
  branding: {
    position: "absolute",
    bottom: 18,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "rgba(255,255,255,0.55)",
  },
  controlsLocked: {
    opacity: 0.35,
  },
  hardcoreToggle: {
    alignItems: "center",
    gap: 4,
  },
  hardcoreLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    color: colors.textSecondary,
  },
  hardcoreLabelActive: {
    color: "#ff4444",
  },
  hardcoreDots: {
    flexDirection: "row",
    gap: 4,
  },
  hardcoreDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  hardcoreDotActive: {
    backgroundColor: colors.textSecondary,
  },
  dropdownBackdrop: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 80,
    paddingRight: 16,
  },
  dropdown: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 150,
    overflow: "hidden",
  },
  dropdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  dropdownItem: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  dropdownItemActive: {
    color: colors.textPrimary,
    fontWeight: "600",
  },
  dropdownCheck: {
    fontSize: 13,
    color: colors.primary,
    marginLeft: 8,
  },
  board: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  cardsScroll: {
    flex: 1,
  },
  cardsContent: {
    flexGrow: 1,
  },
  cardsRow: {
    flex: 1,
    flexDirection: "row",
  },
  column: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: "12%",
  },
  divider: {
    width: 12,
  },
  practiceLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: colors.textSecondary,
  },
  // Overlays
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.85)",
    padding: 16,
  },
  endScroll: {
    flex: 1,
  },
  endScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 8,
    gap: 20,
    alignItems: "center",
  },
  // Start button (reused in end card)
  startButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.background,
  },
  endTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
  },
  statsBlock: {
    width: "100%",
    gap: 12,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  countdownBlock: {
    alignItems: "center",
    gap: 6,
  },
  countdownLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.8,
    color: colors.textSecondary,
    textTransform: "uppercase",
  },
  countdownValue: {
    fontSize: 38,
    fontWeight: "700",
    color: colors.textPrimary,
    fontVariant: ["tabular-nums"],
    letterSpacing: 2,
  },
  practiceButton: {
    width: "100%",
    backgroundColor: "transparent",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  practiceButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  upgradeButton: {
    width: "100%",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    backgroundColor: "#16161a",
    borderWidth: 1,
    borderColor: "#333340",
  },
  upgradeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#9988ff",
    letterSpacing: 0.3,
  },
  wrongSection: {
    width: "100%",
    gap: 8,
  },
  wrongSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.textSecondary,
    marginBottom: 4,
  },
  wrongItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  wrongItemExpanded: {
    borderColor: colors.textSecondary,
  },
  wrongItemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 12,
  },
  wrongItemFlag: {
    fontSize: 28,
  },
  wrongItemText: {
    flex: 1,
    gap: 2,
  },
  wrongItemName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  wrongItemCapital: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  wrongItemChevron: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  wrongItemDetail: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});
