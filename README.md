<p align="center">
  <img src="assets/icon.png" width="120" alt="Capitillian app icon" />
</p>

<h1 align="center">Capitillian</h1>

<p align="center">
  Match countries to capitals, flags, and populations.<br/>
  Spinning globe. Mine mode. Streak badges.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-iOS-000000?logo=apple&logoColor=white" alt="iOS" />
  <img src="https://img.shields.io/badge/built%20with-Expo-1B1F23?logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/payments-RevenueCat-7C3AED" alt="RevenueCat" />
  <img src="https://img.shields.io/badge/crashes-Sentry-362D59?logo=sentry&logoColor=white" alt="Sentry" />
</p>

---

## Screens

<p align="center">
  <img src="screenshots/game-screen.png" width="22%" alt="Game screen — matching board" />
  <img src="screenshots/globe-screen.png" width="22%" alt="Globe screen — tap to learn" />
  <img src="screenshots/countries-list.png" width="22%" alt="Countries list" />
  <img src="screenshots/waiting-screen.png" width="22%" alt="Daily limit countdown" />
</p>

## How it plays

Five cards on the left, five on the right. Tap one card, then tap its
match on the other side. Correct pairs vanish and refill from the pool
of 197 countries. Five minutes, fifty pairs, no lives lost on a wrong
guess — just shame.

### Modes

| Mode             | Left   | Right    | Tier    |
|------------------|--------|----------|---------|
| Names → Capitals | name   | capital  | Free    |
| Flags → Names    | flag   | name     | Free    |
| Flags → Capitals | flag   | capital  | Free    |
| Mine             | any    | any      | Premium |
| All Countries    | any    | any      | Premium |

**Mine** mode: one wrong answer and the run ends. **All Countries**
mode: every nation on Earth in a single sitting — the marathon for
serious learners.

### Free vs Premium

| Feature                   | Free | Premium    |
|---------------------------|------|------------|
| Games per day             | 1    | Unlimited  |
| All Countries (197) mode  | —    | yes        |
| Mine mode                 | —    | yes        |
| Cross-device streak sync  | —    | yes        |
| Earned app icons          | yes  | yes        |

## Streaks & icons

A streak is consecutive calendar days with at least one **completed**
game. There are two independent streaks — Match and Mine — each
rewarding bronze, silver, and gold badges that unlock as alternate
app icons.

<p align="center">
  <img src="assets/icons/match-bronze.png" width="72" alt="Match bronze" />
  <img src="assets/icons/match-silver.png" width="72" alt="Match silver" />
  <img src="assets/icons/match-gold.png" width="72" alt="Match gold" />
  &nbsp;&nbsp;&nbsp;&nbsp;
  <img src="assets/icons/mine-bronze.png" width="72" alt="Mine bronze" />
  <img src="assets/icons/mine-silver.png" width="72" alt="Mine silver" />
  <img src="assets/icons/mine-gold.png" width="72" alt="Mine gold" />
</p>

| Days  | Match icon   | Mine icon   |
|-------|--------------|-------------|
| 7     | Bronze Globe | Bronze Mine |
| 30    | Silver Globe | Silver Mine |
| 100   | Gold Globe   | Gold Mine   |

Streaks cap at 100. Once an icon is unlocked, it's yours to keep —
breaking the streak doesn't take it back.

## Stack

- **React Native** (Expo SDK 54, new architecture enabled)
- **Canvas globe** rendered in a WebView from TopoJSON
- **RevenueCat** for in-app purchases and entitlements
- **Sentry** for crash reporting
- **Supabase** for premium streak sync
- **Jest** + **@testing-library/react-native** for unit tests

## Run

```bash
npm install --legacy-peer-deps
npm start          # Expo dev server
npm test           # Jest
npm run ios        # Build & run on a connected device
```

## Build

Cloud build via EAS:

```bash
eas build --platform ios --profile production --auto-submit
```

Or locally via Xcode:

```bash
npx expo prebuild --platform ios --clean
cd ios && pod install && cd ..
open ios/Capitillian.xcworkspace
# Product → Archive → Distribute App → App Store Connect
```

## Versioning

Conventional commits drive [semantic-release](https://semantic-release.gitbook.io/)
on every push to `main`:

| Commit prefix                      | Release          |
|------------------------------------|------------------|
| `feat:`                            | minor bump       |
| `fix:` / `perf:` / `refactor:`     | patch bump       |
| `chore:` / `docs:` / `style:` / `test:` | no release  |
| `BREAKING CHANGE:` in body         | major bump       |

The CI release job rewrites `package.json`, `app.json`, and
`CHANGELOG.md` so the Expo manifest stays in lockstep with the npm
version and the git tag.
