<p align="center">
  <img src="assets/icons/icon-brushstrokes.png" width="120" />
</p>

# Capitillian

Match countries to capitals, flags, and populations. Spinning globe. Hardcore mode. Badges.

## Stack

- React Native (Expo)
- RevenueCat IAP
- Sentry
- Canvas-rendered globe (WebView + TopoJSON)

## Run

```bash
npm install --legacy-peer-deps
npm start
npm test
```

## Build

```bash
eas build --platform ios --profile preview
```

## Versioning

`feat:` → minor, `fix:` → patch. Releases automated on push to `main`.
