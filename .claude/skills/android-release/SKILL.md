---
name: android-release
description: Build an Android release bundle (.aab) for Capitillian for upload to Google Play. Use when the user asks to build/cut an Android release, bump the Android version, or produce an .aab.
---

# Android Release

Builds the signed release `.aab` per `RELEASE.md`, then reveals it in Finder.

## Steps

1. **Bump `versionCode`** in `app.json` under `expo.android.versionCode` — increment by 1. Do this every run; Google Play rejects re-uploads of an existing versionCode.
   - If the user is also bumping the marketable version (e.g. `1.13.0` -> `1.14.0`), update `expo.version` in `app.json` too, and mirror it in `package.json`'s `version` field.

2. **Run the build**:
   ```bash
   ./scripts/build-android.sh
   ```
   This runs `npx expo prebuild` (regenerates `android/` from `app.json`) then `./gradlew bundleRelease`. This can take a few minutes — run it in the foreground and wait for it to finish, don't background it.

3. **Verify the output exists**:
   ```bash
   ls -la android/app/build/outputs/bundle/release/app-release.aab
   ```

4. **Reveal it in Finder**:
   ```bash
   open -R android/app/build/outputs/bundle/release/app-release.aab
   ```

5. **Print the Play Console form values** the user needs to paste in, reading `expo.version` from `app.json` and the newest entry in `CHANGELOG.md`:

   ```
   Release name: <expo.version, e.g. 1.13.0>

   Release notes:
   <bullet list of Features/Bug Fixes from the top-most CHANGELOG.md entry, rewritten as short user-facing lines — skip anything that's internal/non-user-facing>
   ```

## Next steps (manual, tell the user)

Go to Google Play Console → Closed testing - Alpha → Create release → upload the `.aab` → paste in the release name and release notes printed above → roll out. See `RELEASE.md` for full details.
