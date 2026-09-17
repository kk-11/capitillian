#!/bin/bash
set -e
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home

SLUG=capitillian
BACKUP_DIR=/tmp/android-signing-backup
mkdir -p "$BACKUP_DIR"
cp android/*-release.jks "$BACKUP_DIR"/ 2>/dev/null || true
cp android/gradle.properties "$BACKUP_DIR"/gradle.properties.bak 2>/dev/null || true

npx expo prebuild --clean

# restore the keystore file wiped out by --clean
cp "$BACKUP_DIR"/*-release.jks android/ 2>/dev/null || true

# restore the release password properties, without clobbering anything
# prebuild freshly generated in gradle.properties
if [ -f "$BACKUP_DIR/gradle.properties.bak" ]; then
  grep -E "^[A-Z_]*KEYSTORE_PASSWORD=|^[A-Z_]*KEY_PASSWORD=" "$BACKUP_DIR/gradle.properties.bak" >> android/gradle.properties
fi

# re-apply release signing config to the freshly regenerated build.gradle
# (must be surgical: prebuild also regenerates versionCode/versionName from
# app.json in this file, and a wholesale restore-from-backup would silently
# revert those back to stale values)
python3 - "$SLUG" <<'PYEOF'
import re
import sys

slug = sys.argv[1]
path = "android/app/build.gradle"
with open(path) as f:
    content = f.read()

release_signing_block = f"""        release {{
            storeFile file('../{slug}-release.jks')
            storePassword project.findProperty("KEYSTORE_PASSWORD")
            keyAlias '{slug}'
            keyPassword project.findProperty("KEY_PASSWORD")
        }}
"""

if "signingConfigs.release" in content:
    print("build.gradle already has release signing wired up, skipping patch")
else:
    # insert release block into signingConfigs, right after the debug block closes
    content, n = re.subn(
        r"(signingConfigs \{\s*debug \{[^}]*\}\n)",
        r"\1" + release_signing_block,
        content,
        count=1,
    )
    if n != 1:
        sys.exit("could not find signingConfigs.debug block to patch")

    # point buildTypes.release at the release signing config (non-greedy,
    # brace-bounded match so this can't cross into a different block, and
    # skips past any comment lines gradle's template puts before the line)
    content, n = re.subn(
        r"(release \{(?:(?!\{|\}).)*?)signingConfig signingConfigs\.debug",
        r"\1signingConfig signingConfigs.release",
        content,
        count=1,
        flags=re.DOTALL,
    )
    if n != 1:
        sys.exit("could not find buildTypes.release signingConfig line to patch")

    with open(path, "w") as f:
        f.write(content)
    print("patched build.gradle with release signing config")
PYEOF

cd android && ./gradlew bundleRelease && cd ..
