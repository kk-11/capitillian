# Release Guide

---

## Android

### Build

1. Bump `versionCode` in `app.json` (increment by 1 each release)
2. Run:
```bash
npx expo prebuild && cd android && ./gradlew bundleRelease && cd ..
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Upload

1. Google Play Console → **Closed testing - Alpha** → Create release
2. Upload the `.aab`, set release name to version (e.g. `1.11.1`), add release notes
3. Roll out

### First-time production unlock

- Must run closed test with 12+ testers opted in for 14+ days
- After 14 days: **Production → Apply for access**

---

## iOS

### Release — v1.11.0

## Pre-flight

- [ ] All changes committed and pushed to `main`
- [ ] `app.json` version confirmed: **1.11.0**
- [ ] `package.json` version confirmed: **1.11.0**

---

## Step 1 — Bump version in `app.json`

Update the `version` field (and `buildNumber` if needed). The native project is generated from this file — it's the single source of truth.

---

## Step 2 — Install JS dependencies

```bash
npm install
```

---

## Step 3 — Regenerate native iOS project

```bash
npx expo prebuild
```

This reads `app.json` and rewrites `ios/` with the correct version, bundle ID, plugins etc. Always run this before archiving — it's what keeps app.json in sync with Xcode.

---

## Step 4 — Run CocoaPods

```bash
cd ios
pod install
cd ..
```

---

## Step 5 — Open Xcode

```bash
open ios/Capitillian.xcworkspace
```

(Always open the `.xcworkspace`, not `.xcodeproj`)

---

## Step 6 — Archive

1. Set the scheme to **Capitillian** and destination to **Any iOS Device (arm64)**
2. **Product → Archive**
3. Wait for the archive to complete — Organizer opens automatically

---

## Step 7 — Distribute via Xcode Organizer

1. Select the new archive → **Distribute App**
2. Choose **App Store Connect** → **Upload**
3. Follow the wizard (signing should be automatic)

---

## Step 8 — App Store Connect

1. Open [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Find the new build under **TestFlight** — confirm it processed cleanly
3. Add it to the release version, fill in What's New
4. Submit for review

---

## Notes

- Signing: Automatic, team "Killian de Buiteir", bundle ID `com.capitillian.app`
- Xcode swaps to Apple Distribution cert automatically at archive time — the Development cert shown in Signing & Capabilities is expected
- **Version fix**: `Info.plist` had `CFBundleShortVersionString` hardcoded as `1.7.2`. Fixed to use `$(MARKETING_VERSION)` / `$(CURRENT_PROJECT_VERSION)`. Set `MARKETING_VERSION = 1.11.0` in `project.pbxproj` (both Debug + Release). Going forward, only `project.pbxproj` needs updating on each release.

