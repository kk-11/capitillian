# Capitillian — Product Design

## Concept

A geography memorisation suite. The core interaction is a timed matching game —
pair countries with capitals, flags, etc. Simple enough to play daily, deep enough
to actually learn 197 countries over time.

---

## The Matching Game

5 cards on the left, 5 on the right. Tap one card to select it, tap the opposing
side to attempt a match. Correct pairs vanish and are replaced from the pool.

### Standard Round (Free)
- **50 pairs** to match
- **5 minute timer**
- Score at end: **x / 50** pairs matched + time taken (DNF if timer runs out)
- Wrong guesses tracked separately — they don't reduce the score, just show as a stat
- Wrong answer: cards flash red, shake, remain on board (no lives lost)
- 1 game per day. Countdown shown to next available game.

### Mine Mode (Premium)
- Same structure but **one wrong answer = game over**
- Score is how many pairs you matched before failing
- Separate daily play limit (still 1/day for fairness)

### All Countries Mode (Premium)
- All 197 countries in a single sitting — match them all
- No time limit (or optional timer)
- The "marathon" mode for serious learners

---

## Card Faces

```ts
type CardFace = "name" | "capital" | "flag";
```

Any two faces can be paired as a mode. Three default modes:

| Mode             | Left     | Right     |
|------------------|----------|-----------|
| Names → Capitals | `name`   | `capital` |
| Flags → Names    | `flag`   | `name`    |
| Flags → Capitals | `flag`   | `capital` |

---

## Free vs Premium

| Feature                        | Free        | Premium     |
|-------------------------------|-------------|-------------|
| Games per day                 | 1           | Unlimited   |
| Pairs per game                | 50          | 50          |
| All Countries mode (197)      | —           | ✓           |
| Mine mode                     | —           | ✓           |
| Cross-device streak sync      | —           | ✓           |
| App icon unlocks              | ✓ (earned)  | ✓ (earned)  |

---

## Daily Limit & Countdown

- Free users: 1 game per day, resets at midnight local time
- After completing or abandoning a game, show:
  - Today's score
  - Countdown to next game ("Come back in 14h 23m")
  - Upsell for premium (play again now)
- Game start timestamp stored locally (and in Supabase for premium users)

---

## Streaks

A streak = playing at least one game on consecutive calendar days.

Two independent streaks:
- **Match streak** — days played in standard/all-countries mode
- **Mine streak** — days survived at least one pair in mine mode

Rules:
- Streak increments once per day (first completed game of the day counts)
- Streak breaks if you miss a day entirely
- Streaks cap at **100** — no obligation beyond that
- Streak data stored locally for free users, synced via Supabase for premium

### Streak Milestones & App Icons

- Streak only increments on a **completed** game (all 50 pairs matched).
- App icons unlock permanently once earned — streak breaking doesn't revoke them.
- Icons are **bronze / silver / gold** for both modes, shown on the home screen.

| Milestone  | Mode   | Icon ID          | Label               |
|------------|--------|------------------|---------------------|
| 7 days     | Match  | `match-bronze`   | Bronze Globe        |
| 30 days    | Match  | `match-silver`   | Silver Globe        |
| 100 days   | Match  | `match-gold`     | Gold Globe          |
| 7 days     | Mine   | `mine-bronze`    | Bronze Mine         |
| 30 days    | Mine   | `mine-silver`    | Silver Mine         |
| 100 days   | Mine   | `mine-gold`      | Gold Mine           |

Streaks cap at 100. No milestone beyond gold.

---

## Screens

### Home / Game Entry
- Opens directly to the game board (or daily limit screen if used up)
- Mode selector (accessible but not prominent)
- Streak display

### Game Screen
- 5×5 matching board
- Timer (countdown from 5:00)
- Progress: x / 50 pairs matched
- Mine mode: shows "MINE MODE — one strike" warning

### End Screen
- Score summary: pairs matched, wrong guesses, time taken
- Streak update (incremented? broken?)
- Play again (premium) / countdown (free)
- Streak milestone celebration if applicable

### Settings / Profile
- Sign in / sign out
- Premium status
- Streak history
- App icon picker (shows locked/unlocked icons)

---

## Data Model

### Static (bundled)

```ts
type Country = {
  code: string;      // "FR"
  name: string;      // "France"
  capital: string;   // "Paris"
  flag: string;      // "🇫🇷"
  continent: string; // "Europe"
};
```

### Local Storage (all users)

```ts
type LocalState = {
  lastPlayedDate: string;        // "2026-04-01" — for daily limit
  matchStreak: number;
  mineStreak: number;
  matchStreakLastDate: string;
  mineStreakLastDate: string;
  unlockedIcons: string[];       // ["globe-7", "mine-dark-7", ...]
  activeIcon: string;
};
```

### Supabase (premium users — sync & backup)

```ts
// game_sessions table
type GameSession = {
  id: string;
  user_id: string;
  mode: "standard" | "mine" | "all-countries";
  card_mode: string;             // "name-capital" | "flag-name" | "flag-capital"
  pairs_matched: number;
  wrong_guesses: number;
  duration_seconds: number;
  completed: boolean;
  played_at: string;
};

// user_profiles (already in migration)
// + match_streak, mine_streak, match_streak_last_date, mine_streak_last_date
// + unlocked_icons: string[]
```

---

## Future

- More card faces: continent, currency, population tier, landlocked/island
- Multiplayer / daily challenge (same seed for all players)
- Progress heatmap (which countries you keep missing)
- Sound effects
