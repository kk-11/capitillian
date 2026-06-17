#!/bin/bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
npx expo prebuild && cd android && ./gradlew bundleRelease && cd ..
