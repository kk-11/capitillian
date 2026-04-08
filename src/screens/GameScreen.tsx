import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from "react-native";
import * as Sentry from "@sentry/react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;
import { SafeAreaView } from "react-native-safe-area-context";
import { usePremium } from "../contexts/PremiumContext";
import { useFaceSelector } from "../game/useFaceSelector";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGameEngine, ROUND_SECONDS, type PersistedGameState } from "../game/useGameEngine";
import { useDailyLimit, DAILY_PLAY_LIMIT } from "../hooks/useDailyLimit";
import { usePerfectStreak } from "../hooks/usePerfectStreak";
import { useBadgeProgress } from "../hooks/useBadgeProgress";
import FaceHeader from "../components/FaceHeader";
import GameCard from "../components/GameCard";
import Globe from "../components/Globe";
import HardcoreVignette from "../components/HardcoreVignette";
import PremiumDialog from "../components/PremiumDialog";
import { getFaceValue, formatPopulation, REGIONS, MODE_LABELS, COUNTRIES, type GameMode, type Country } from "../data/countries";
import { colors } from "../theme/colors";
import * as Haptics from "expo-haptics";

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
// Badge definitions
// ---------------------------------------------------------------------------

const BADGE_GROUPS: Array<{
  mode: GameMode;
  label: string;
  emoji: string;
  tiers: Array<{ icon: string; name: string; req: number; legendary?: boolean }>;
}> = [
  {
    mode: "all", label: "World", emoji: "🌍",
    tiers: [
      { icon: "🥉", name: "Explorer",   req: 1   },
      { icon: "🥈", name: "Scholar",    req: 10  },
      { icon: "🥇", name: "Master",     req: 25  },
      { icon: "⭐", name: "LEGENDARY",  req: 100, legendary: true },
    ],
  },
  {
    mode: "africa", label: "Africa", emoji: "🌍",
    tiers: [
      { icon: "🥉", name: "Explorer", req: 1  },
      { icon: "🥈", name: "Scholar",  req: 5  },
      { icon: "🥇", name: "Master",   req: 10 },
    ],
  },
  {
    mode: "asia", label: "Asia", emoji: "🌏",
    tiers: [
      { icon: "🥉", name: "Explorer", req: 1  },
      { icon: "🥈", name: "Scholar",  req: 5  },
      { icon: "🥇", name: "Master",   req: 10 },
    ],
  },
  {
    mode: "europe", label: "Europe", emoji: "⚜️",
    tiers: [
      { icon: "🥉", name: "Explorer", req: 1  },
      { icon: "🥈", name: "Scholar",  req: 5  },
      { icon: "🥇", name: "Master",   req: 10 },
    ],
  },
  {
    mode: "eurasia", label: "Eurasia", emoji: "🌐",
    tiers: [
      { icon: "🥉", name: "Explorer", req: 1  },
      { icon: "🥈", name: "Scholar",  req: 5  },
      { icon: "🥇", name: "Master",   req: 10 },
    ],
  },
  {
    mode: "north america", label: "N. America", emoji: "🌎",
    tiers: [
      { icon: "🥉", name: "Explorer", req: 1  },
      { icon: "🥈", name: "Scholar",  req: 5  },
      { icon: "🥇", name: "Master",   req: 10 },
    ],
  },
  {
    mode: "south america", label: "S. America", emoji: "🌎",
    tiers: [
      { icon: "🥉", name: "Explorer", req: 1  },
      { icon: "🥈", name: "Scholar",  req: 5  },
      { icon: "🥇", name: "Master",   req: 10 },
    ],
  },
  {
    mode: "oceania", label: "Oceania", emoji: "🏝️",
    tiers: [
      { icon: "🥉", name: "Explorer", req: 1  },
      { icon: "🥈", name: "Scholar",  req: 5  },
      { icon: "🥇", name: "Master",   req: 10 },
    ],
  },
  {
    mode: "caribbean", label: "Caribbean", emoji: "🏖️",
    tiers: [
      { icon: "🥉", name: "Explorer", req: 1  },
      { icon: "🥈", name: "Scholar",  req: 5  },
      { icon: "🥇", name: "Master",   req: 10 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function GameScreen() {
  const { isPremium, purchase, restorePurchases } = usePremium();
  const { left, right, cycleLeft, cycleRight } = useFaceSelector(isPremium);
  const { state, startGame, restoreGame, selectCard } = useGameEngine();
  const { playsToday, hasPlayedToday, hasPracticedToday, secondsLeft: countdownSecs, recordPlay, recordPractice } = useDailyLimit(isPremium);
  const { streak: perfectStreak, recordResult: recordStreakResult } = usePerfectStreak();
  const { counts: badgeCounts, increment: incrementBadge } = useBadgeProgress();
  const [gameMode, setGameMode] = useState<GameMode>("all");
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [isHardcore, setIsHardcore] = useState(false);
  const [globeFrame, setGlobeFrame] = useState(0);
  const GLOBE_FRAMES = ["🌍", "🌎", "🌏"];
  useEffect(() => {
    const id = setInterval(() => setGlobeFrame(f => (f + 1) % 3), 400);
    return () => clearInterval(id);
  }, []);
  const [focusedCountry, setFocusedCountry] = useState<Country | null>(null);
  const [freePalestine, setFreePalestine] = useState(false);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [listExpandedCode, setListExpandedCode] = useState<string | null>(null);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const currentPageRef = useRef(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const [globeCountry, setGlobeCountry] = useState<Country | null>(null);
  const [highlightCode, setHighlightCode] = useState<string | null>(null);
  const stopButtonOpacity = useRef(new Animated.Value(0)).current;
  // Track game-just-finished synchronously so the countdown appears immediately
  // without waiting for the async AsyncStorage write in recordPlay.
  const [gameEndedAsFree, setGameEndedAsFree] = useState(false);
  const recordedRef = useRef(false);

  const PREFS_KEY = "@cap/prefs";
  const GAME_KEY  = "@cap/game";

  // Load persisted prefs + game state on mount
  useEffect(() => {
    (async () => {
      try {
        const [prefsRaw, gameRaw] = await Promise.all([
          AsyncStorage.getItem(PREFS_KEY),
          AsyncStorage.getItem(GAME_KEY),
        ]);
        if (prefsRaw) {
          const prefs = JSON.parse(prefsRaw) as { gameMode: GameMode; isHardcore: boolean };
          setGameMode(prefs.gameMode);
          setIsHardcore(prefs.isHardcore);
          if (gameRaw) {
            try {
              const saved = JSON.parse(gameRaw) as PersistedGameState;
              restoreGame(saved);
              return;
            } catch (e) {
              Sentry.captureException(e, { extra: { context: "restoreGame", gameRaw } });
              await AsyncStorage.removeItem(GAME_KEY);
            }
          }
          startGame(REGIONS[prefs.gameMode], isPremium, false, prefs.isHardcore);
        } else {
          startGame(REGIONS[gameMode], isPremium, false, isHardcore);
        }
      } catch (e) {
        Sentry.captureException(e, { extra: { context: "loadPersistedState" } });
        startGame(REGIONS[gameMode], isPremium, false, isHardcore);
      }
    })();
  }, []);

  // Persist prefs whenever they change
  useEffect(() => {
    AsyncStorage.setItem(PREFS_KEY, JSON.stringify({ gameMode, isHardcore })).catch(() => {});
  }, [gameMode, isHardcore]);

  // Persist game state on every meaningful change
  useEffect(() => {
    const { status, leftCards, rightCards, pool, pendingMatched, wrongCountries,
            pairsMatched, wrongGuesses, secondsLeft, targetPairs, hasTimer, countUp, isHardcore: hc } = state;
    if (status === "playing" || status === "ready") {
      const saved: PersistedGameState = {
        leftCodes: leftCards.map(c => c.code),
        rightCodes: rightCards.map(c => c.code),
        poolCodes: pool.map(c => c.code),
        pendingMatched,
        wrongCodes: wrongCountries.map(c => c.code),
        pairsMatched,
        wrongGuesses,
        secondsLeft,
        targetPairs,
        hasTimer,
        countUp,
        isHardcore: hc,
      };
      AsyncStorage.setItem(GAME_KEY, JSON.stringify(saved)).catch(() => {});
    } else if (status === "won" || status === "timeout") {
      AsyncStorage.removeItem(GAME_KEY).catch(() => {});
    }
  }, [state.status, state.leftCards, state.rightCards, state.pool, state.pairsMatched,
      state.wrongGuesses, state.secondsLeft, state.pendingMatched]);

  // Reset focused country when a new game starts
  useEffect(() => {
    if (status === "ready") {
      setFocusedCountry(null);
    }
  }, [status]);

  // Record daily play + perfect streak when a non-practice game ends.
  useEffect(() => {
    const ended = state.status === "won" || state.status === "timeout";
    if (ended && !state.countUp && !recordedRef.current) {
      // practice games have no timer and no countUp — exclude them via hasTimer
    }
    if (ended && !recordedRef.current) {
      recordedRef.current = true;
      if (state.hasTimer) {
        recordStreakResult(state.wrongGuesses);
      }
      if (!isPremium && state.hasTimer) {
        setGameEndedAsFree(true);
        recordPlay();
      }
      // Badge progress: perfect hardcore timed round
      if (state.status === "won" && isHardcore && state.wrongGuesses === 0 && state.hasTimer) {
        incrementBadge(gameMode);
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

  // Direct card press handler — updates globe AND game engine simultaneously
  const handleCardPress = (side: "left" | "right", index: number) => {
    const country = side === "left" ? leftCards[index] : rightCards[index];
    if (country) { setFocusedCountry(country); setHighlightCode(country.code); }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    selectCard(side, index);
  };

  // Wrong guess — heavy, then a second heavy hit after a short delay
  useEffect(() => {
    if (wrongFlash) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [wrongFlash]);

  // Correct match — two quick light-heavy taps
  useEffect(() => {
    if (matchFlash) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 80);
    }
  }, [matchFlash]);

  useEffect(() => {
    Animated.timing(stopButtonOpacity, {
      toValue: status === "playing" ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [status]);

  const timerColor =
    !countUp && secondsLeft < 60 ? styles.timerRed : styles.timerDefault;

  const timeTaken = countUp ? secondsLeft : ROUND_SECONDS - secondsLeft;
  const isDisabled = wrongFlash !== null || matchFlash !== null;

  // Freemium gate flags
  const showCountdown  = !isPremium && (hasPlayedToday || gameEndedAsFree);
  const canPlayAgain   = isPremium || !hasPlayedToday;
  const canPractice    = wrongCountries.length > 1 && (isPremium || !hasPracticedToday);
  const playsRemaining = Math.max(0, DAILY_PLAY_LIMIT - playsToday);

  const handleGlobeTap = (lat: number, lon: number) => {
    let nearest = COUNTRIES[0];
    let minDist = Infinity;
    for (const c of COUNTRIES) {
      const d = (c.lat - lat) ** 2 + (c.lng - lon) ** 2;
      if (d < minDist) { minDist = d; nearest = c; }
    }
    setGlobeCountry(nearest);
    setHighlightCode(nearest.code);
  };

  const goToPage = (page: number) => {
    currentPageRef.current = page;
    setCurrentPage(page);
    Animated.spring(translateX, {
      toValue: -page * SCREEN_WIDTH,
      useNativeDriver: true,
      tension: 68,
      friction: 12,
    }).start();
  };

  const swipeGesture = useMemo(() =>
    Gesture.Pan()
      .runOnJS(true)
      .enabled(currentPage !== 1)
      .activeOffsetX([-15, 15])
      .failOffsetY([-15, 15])
      .onUpdate((e) => {
        const base = -currentPageRef.current * SCREEN_WIDTH;
        const clamped = Math.max(-3 * SCREEN_WIDTH, Math.min(0, base + e.translationX));
        translateX.setValue(clamped);
      })
      .onEnd((e) => {
        const page = currentPageRef.current;
        if (e.translationX < -50 && page < 3) goToPage(page + 1);
        else if (e.translationX > 50 && page > 0) goToPage(page - 1);
        else goToPage(page);
      }),
  [currentPage]);

  // Group all countries by continent for the list page
  const continents = Array.from(new Set(COUNTRIES.map(c => c.continent))).sort();

  return (
    <GestureDetector gesture={swipeGesture}>
    <View style={styles.container}>
      {/* Single globe — fixed background, never re-mounts */}
      <Globe
        targetLat={focusedCountry?.lat}
        targetLng={focusedCountry?.lng}
        interactive={currentPage === 1}
        onSwipeLeft={() => goToPage(2)}
        onSwipeRight={() => goToPage(0)}
        onGlobeTap={handleGlobeTap}
        highlightCode={highlightCode}
      />
      {isHardcore && currentPage === 0 && <HardcoreVignette />}

      {/* ------------------------------------------------------------------ */}
      {/* Animated pager row — slides horizontally, globe shows through      */}
      {/* ------------------------------------------------------------------ */}
      <Animated.View style={[styles.pagerRow, { transform: [{ translateX }] }]} pointerEvents="box-none">
        {/* ---------------------------------------- */}
        {/* Page 1: Game UI                          */}
        {/* ---------------------------------------- */}
        <View style={styles.page}>
          <SafeAreaView style={styles.safe}>
          <View style={styles.topBar}>
            <View>
              {hasTimer ? (
                <Text style={[styles.timer, timerColor]}>{formatTime(secondsLeft)}</Text>
              ) : (
                <Text style={styles.practiceLabel}>PRACTICE</Text>
              )}
            </View>
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
              <TouchableOpacity
                onPress={() => setShowModeDropdown(true)}
                activeOpacity={0.7}
                disabled={status === "playing"}
              >
                <Text style={[styles.modeLabel, status === "playing" && styles.controlsLocked]}>
                  {MODE_LABELS[gameMode]}
                </Text>
              </TouchableOpacity>
              <Text style={styles.progress}>{pairsMatched} / {targetPairs}</Text>
            </View>
          </View>

          <View style={[styles.board]}>
            <Animated.View
              style={[styles.stopButtonAbsolute, { opacity: stopButtonOpacity }]}
              pointerEvents={status === "playing" ? "auto" : "none"}
            >
              <TouchableOpacity
                onPress={() => startGame(REGIONS[gameMode], isPremium, false, isHardcore)}
                activeOpacity={0.5}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.stopButtonText}>✕</Text>
              </TouchableOpacity>
            </Animated.View>
            <ScrollView
              style={styles.cardsScroll}
              contentContainerStyle={styles.cardsContent}
              scrollEnabled={false}
            >
              <View style={styles.cardsRow}>
                <View style={styles.column}>
                  <FaceHeader face={left} isPremium={isPremium} onPress={cycleLeft} />
                  {leftCards.map((card, i) => (
                    <GameCard
                      key={`left-${roundId}-${card.code}`}
                      value={getFaceValue(card, left)}
                      face={left}
                      isSelected={selected?.side === "left" && selected?.index === i}
                      isWrong={wrongFlash?.leftIndex === i}
                      isMatched={matchFlash?.code === card.code}
                      isSettled={pendingMatched.includes(card.code)}
                      onPress={() => handleCardPress("left", i)}
                      disabled={isDisabled || pendingMatched.includes(card.code)}
                    />
                  ))}
                </View>

                <View style={styles.divider} />

                <View style={styles.column}>
                  <FaceHeader face={right} isPremium={isPremium} onPress={cycleRight} />
                  {rightCards.map((card, i) => (
                    <GameCard
                      key={`right-${roundId}-${card.code}`}
                      value={getFaceValue(card, right)}
                      face={right}
                      isSelected={selected?.side === "right" && selected?.index === i}
                      isWrong={wrongFlash?.rightIndex === i}
                      isMatched={matchFlash?.code === card.code}
                      isSettled={pendingMatched.includes(card.code)}
                      onPress={() => handleCardPress("right", i)}
                      disabled={isDisabled || pendingMatched.includes(card.code)}
                    />
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>

          {(status === "won" || status === "timeout") && (
            <View style={styles.overlay}>
              <ScrollView
                style={styles.endScroll}
                contentContainerStyle={styles.endScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {status === "won" ? (
                  <Text style={styles.endTitle}>Round Complete! 🎉</Text>
                ) : (
                  <Text style={styles.endTitle}>Game Over!</Text>
                )}

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

                {canPlayAgain ? (
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => { startGame(REGIONS[gameMode], isPremium, false, isHardcore); }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.startButtonText}>
                      {status === "won" ? "Play Again" : "Try Again"}
                    </Text>
                    {!isPremium && (
                      <Text style={styles.playsRemainingText}>
                        {playsRemaining} {playsRemaining === 1 ? "play" : "plays"} left today
                      </Text>
                    )}
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

                {!isPremium && (
                  <TouchableOpacity
                    style={styles.upgradeButton}
                    onPress={() => setShowPremiumDialog(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.upgradeText}>✦ Unlock Unlimited — €5</Text>
                  </TouchableOpacity>
                )}

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
        </View>

        {/* ---------------------------------------- */}
        {/* Page 2: Globe (transparent — globe       */}
        {/* background shows through & is now        */}
        {/* interactive)                             */}
        {/* ---------------------------------------- */}
        <View style={styles.page} pointerEvents="none" />

        {/* ---------------------------------------- */}
        {/* Page 3: Countries list                   */}
        {/* ---------------------------------------- */}
        <View style={styles.page}>
          <SafeAreaView style={styles.safe}>
            <Text style={styles.listTitle}>All Countries</Text>
            <ScrollView
              style={styles.listScroll}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {continents.map((continent) => (
                <View key={continent}>
                  <Text style={styles.continentHeader}>{continent}</Text>
                  {COUNTRIES.filter(c => c.continent === continent)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((country) => {
                      const expanded = listExpandedCode === country.code;
                      return (
                        <TouchableOpacity
                          key={country.code}
                          style={[styles.countryRow, expanded && styles.countryRowExpanded]}
                          onPress={() => {
                            const isExpanding = !expanded;
                            setListExpandedCode(isExpanding ? country.code : null);
                            if (isExpanding) {
                              setFocusedCountry(country);
                              setHighlightCode(country.code);
                            }
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.countryRowMain}>
                            <Text style={styles.countryFlag}>{country.flag}</Text>
                            <View style={styles.countryText}>
                              <Text style={styles.countryName}>{country.name}</Text>
                              <Text style={styles.countryCapital}>{country.capital}</Text>
                            </View>
                            <View style={styles.countryRight}>
                              <Text style={styles.countryPop}>{formatPopulation(country.population)}</Text>
                              <Text style={styles.countryCode}>{country.code}</Text>
                            </View>
                          </View>
                          {expanded && (
                            <View style={styles.countryDetail}>
                              <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Population</Text>
                                <Text style={styles.detailValue}>{country.population.toLocaleString()}</Text>
                              </View>
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
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
        {/* ---------------------------------------- */}
        {/* Page 4: Goals / Badges                   */}
        {/* ---------------------------------------- */}
        <View style={styles.page}>
          <SafeAreaView style={styles.safe}>
            <Text style={styles.listTitle}>Goals</Text>
            <Text style={styles.goalsSubtitle}>Perfect · Hardcore · No mistakes</Text>
            <ScrollView
              style={styles.listScroll}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {BADGE_GROUPS.map(({ mode, label, emoji, tiers }) => {
                const count = badgeCounts[mode] ?? 0;
                return (
                  <View key={mode} style={styles.badgeGroup}>
                    <Text style={styles.continentHeader}>{emoji} {label}</Text>
                    {tiers.map(({ icon, name, req, legendary }) => {
                      const unlocked = count >= req;
                      const progress = Math.min(count, req) / req;
                      return (
                        <View
                          key={name}
                          style={[styles.badgeRow, unlocked && styles.badgeRowUnlocked, legendary && styles.badgeRowLegendary]}
                        >
                          <Text style={[styles.badgeTierIcon, unlocked && styles.badgeTierIconUnlocked]}>{icon}</Text>
                          <View style={styles.badgeInfo}>
                            <View style={styles.badgeNameRow}>
                              <Text style={[styles.badgeName, unlocked && styles.badgeNameUnlocked, legendary && styles.badgeNameLegendary]}>
                                {name}
                              </Text>
                              {unlocked && <Text style={styles.badgeCheck}>✓</Text>}
                            </View>
                            <View style={styles.badgeBarBg}>
                              <View style={[styles.badgeBarFill, { width: `${progress * 100}%` as any }, legendary && styles.badgeBarLegendary]} />
                            </View>
                          </View>
                          <Text style={[styles.badgeCount, unlocked && styles.badgeCountUnlocked]}>
                            {count}/{req}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Animated.View>

      {/* ------------------------------------------------------------------ */}
      {/* Page dots                                                           */}
      {/* ------------------------------------------------------------------ */}
      <TouchableOpacity
        style={styles.dotsContainer}
        onPress={() => goToPage((currentPage + 1) % 4)}
        activeOpacity={1}
        hitSlop={{ top: 12, bottom: 12, left: 20, right: 20 }}
      >
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, currentPage === i && styles.dotActive]} />
        ))}
      </TouchableOpacity>

      {/* Branding */}
      <TouchableOpacity onPress={() => setFreePalestine(f => !f)} activeOpacity={0.7} style={styles.brandingTouchable}>
        {freePalestine ? (
          <Text style={styles.branding}>🇵🇸 free palestine</Text>
        ) : (
          <Text style={styles.branding}>{GLOBE_FRAMES[globeFrame]} capitillian</Text>
        )}
      </TouchableOpacity>

      {/* Mode dropdown modal */}
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

      {/* Globe country info panel */}
      {currentPage === 1 && globeCountry && (
        <TouchableOpacity
          style={styles.globePanel}
          onPress={() => setGlobeCountry(null)}
          activeOpacity={0.9}
        >
          <View style={styles.globePanelRow}>
            <Text style={styles.globePanelFlag}>{globeCountry.flag}</Text>
            <View style={styles.globePanelText}>
              <Text style={styles.globePanelName}>{globeCountry.name}</Text>
              <Text style={styles.globePanelCapital}>{globeCountry.capital}</Text>
            </View>
            <Text style={styles.globePanelContinent}>{globeCountry.continent}</Text>
          </View>
        </TouchableOpacity>
      )}

      <PremiumDialog
        visible={showPremiumDialog}
        onDismiss={() => setShowPremiumDialog(false)}
        onPurchase={async () => {
          await purchase();
          setShowPremiumDialog(false);
        }}
        onRestore={async () => {
          const didRestore = await restorePurchases();
          if (didRestore) setShowPremiumDialog(false);
        }}
      />
    </View>
    </GestureDetector>
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
  // Pager
  pagerRow: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: SCREEN_WIDTH * 4,
    flexDirection: "row",
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
    overflow: "hidden",
  },
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },
  safeTransparent: {
    flex: 1,
    backgroundColor: "transparent",
  },
  // Page dots
  dotsContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  dotActive: {
    backgroundColor: "rgba(255,255,255,0.85)",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Globe page
  globePageLabel: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  globePageTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.4)",
  },
  // Countries list page
  listTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: colors.textPrimary,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  continentHeader: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: colors.textSecondary,
    marginTop: 20,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  countryRow: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginBottom: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "transparent",
  },
  countryRowExpanded: {
    borderColor: colors.border,
  },
  countryRowMain: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 12,
  },
  countryFlag: {
    fontSize: 24,
    width: 32,
    textAlign: "center",
  },
  countryText: {
    flex: 1,
    gap: 2,
  },
  countryName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  countryCapital: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  countryRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  countryPop: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  countryCode: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  countryDetail: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  // Globe country panel
  globePanel: {
    position: "absolute",
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: "rgba(20,20,24,0.92)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  globePanelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  globePanelFlag: {
    fontSize: 36,
  },
  globePanelText: {
    flex: 1,
    gap: 3,
  },
  globePanelName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  globePanelCapital: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  globePanelContinent: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  stopButtonAbsolute: {
    zIndex: 10,
    opacity: 0.3,
  },
  stopButtonText: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.textPrimary,
    letterSpacing: 0.5,
    paddingVertical: 4,
    paddingHorizontal: 4,
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
  brandingTouchable: {
    position: "absolute",
    bottom: 18,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  branding: {
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
  playsRemainingText: {
    fontSize: 12,
    color: colors.background,
    opacity: 0.7,
    marginTop: 3,
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
  // Goals page
  goalsSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.6,
    color: colors.textSecondary,
    paddingHorizontal: 20,
    paddingBottom: 4,
    textTransform: "uppercase",
  },
  badgeGroup: {
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginBottom: 4,
    gap: 12,
    borderWidth: 1,
    borderColor: "transparent",
    opacity: 0.55,
  },
  badgeRowUnlocked: {
    opacity: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  badgeRowLegendary: {
    borderColor: "rgba(255,200,50,0.35)",
    backgroundColor: "rgba(30,22,8,0.9)",
  },
  badgeTierIcon: {
    fontSize: 24,
    width: 32,
    textAlign: "center",
    opacity: 0.4,
  },
  badgeTierIconUnlocked: {
    opacity: 1,
  },
  badgeInfo: {
    flex: 1,
    gap: 6,
  },
  badgeNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  badgeNameUnlocked: {
    color: colors.textPrimary,
  },
  badgeNameLegendary: {
    color: "#ffd700",
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  badgeCheck: {
    fontSize: 12,
    color: "#4ade80",
    fontWeight: "800",
  },
  badgeBarBg: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 2,
    overflow: "hidden",
  },
  badgeBarFill: {
    height: 3,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 2,
  },
  badgeBarLegendary: {
    backgroundColor: "#ffd700",
  },
  badgeCount: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    opacity: 0.5,
    minWidth: 36,
    textAlign: "right",
  },
  badgeCountUnlocked: {
    opacity: 1,
    color: colors.textPrimary,
  },
});
