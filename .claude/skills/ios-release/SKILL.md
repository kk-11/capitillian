---
name: ios-release
description: Prepare and archive an iOS release for Capitillian for upload to App Store Connect / TestFlight. Use when the user asks to build/cut an iOS release, bump the iOS version, or archive the app in Xcode.
---

# iOS Release

Prepares the native project per `RELEASE.md`. Archiving can be done either in the Xcode GUI or via the `xcodebuild` CLI; distribution/upload to App Store Connect still requires the Xcode Organizer GUI (or Transporter).

## Steps

1. **Bump the version** in `app.json`:
   - If the user is bumping the marketable version (e.g. `1.13.0` -> `1.14.0`), update `expo.version`, and mirror it in `package.json`'s `version` field.
   - Always bump `expo.ios.buildNumber` by 1 — App Store Connect rejects re-uploads of an existing build number for the same version.

2. **Regenerate the native iOS project**:
   ```bash
   npx expo prebuild
   ```
   This reads `app.json` and rewrites `ios/` with the correct version, bundle ID, plugins, etc. Always run this before archiving.
   - Note: the global `rtk` hook mangles bare `npx`/`xcodebuild` invocations (rewrites them into a broken `npm` call). If you hit `npm error Missing script: "expo"`, prefix the command with `rtk proxy` instead, e.g. `rtk proxy npx expo prebuild`.

3. **Install CocoaPods**:
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Archive the app.** Ask the user which they'd prefer if unclear:
   - **Option A — Xcode GUI**:
     ```bash
     open ios/Capitillian.xcworkspace
     ```
     Always open the `.xcworkspace`, not `.xcodeproj`. Then in Xcode: set scheme to "Capitillian", destination to "Any iOS Device (arm64)", Product -> Archive (Organizer opens automatically when done).
   - **Option B — `xcodebuild` CLI** (non-interactive, same result):
     ```bash
     cd ios && rtk proxy xcodebuild -workspace Capitillian.xcworkspace -scheme Capitillian -configuration Release -destination "generic/platform=iOS" -archivePath build/Capitillian.xcarchive archive
     ```
     Produces `ios/build/Capitillian.xcarchive`. Signing is automatic (team "Killian de Buiteir", bundle ID `com.capitillian.app`) — the archive step itself signs with the Development cert, which is expected; Xcode swaps to the Apple Distribution cert during the distribute/export step below.

5. **Distribute to App Store Connect** — this step needs the Xcode GUI regardless of how the archive was made:
   ```
   1. If archived via CLI, open Xcode -> Window -> Organizer (or `open ios/build/Capitillian.xcarchive` opens Organizer directly), otherwise it's already open from Product -> Archive.
   2. Select the new archive -> Distribute App -> App Store Connect -> Upload

   In App Store Connect (appstoreconnect.apple.com):
   3. Under TestFlight, confirm the new build processed cleanly
   4. Add it to the release version, paste in "What's New" below, submit for review
   ```

6. **Print the App Store Connect form values**, reading `expo.version` from `app.json` and the newest entry in `CHANGELOG.md`:

   ```
   Version: <expo.version, e.g. 1.13.0>

   What's New:
   <bullet list of Features/Bug Fixes from the top-most CHANGELOG.md entry, rewritten as short user-facing lines — skip anything that's internal/non-user-facing>
   ```

## Notes

- Signing is automatic; Xcode swaps to the Apple Distribution cert at archive time (Development cert shown in Signing & Capabilities beforehand is expected).
- First-time production unlock and other release details are in `RELEASE.md`.
