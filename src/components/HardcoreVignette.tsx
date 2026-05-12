import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";
import WebView from "react-native-webview";

const HTML = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
  *{margin:0;padding:0}
  html,body{width:100%;height:100%;overflow:hidden;background:transparent}
  .vignette{
    position:fixed;inset:0;
    background: radial-gradient(
      ellipse at center,
      transparent            0%,
      transparent           42%,
      rgba(140,0,0,0.04)    54%,
      rgba(120,0,0,0.10)    64%,
      rgba(100,0,0,0.20)    74%,
      rgba( 80,0,0,0.32)    84%,
      rgba( 60,0,0,0.46)    93%,
      rgba( 40,0,0,0.58)   100%
    );
    pointer-events:none;
  }
</style>
</head>
<body><div class="vignette"></div></body>
</html>`;

export default function HardcoreVignette({ visible }: { visible: boolean }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
      <WebView
        style={styles.webview}
        source={{ html: HTML }}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        originWhitelist={["*"]}
        javaScriptEnabled={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
