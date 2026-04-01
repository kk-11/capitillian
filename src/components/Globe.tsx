import React from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

// Self-contained canvas globe — no external dependencies.
const HTML = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:100%;height:100%;overflow:hidden;background:#0a0a0a}
  canvas{display:block}
</style>
</head>
<body>
<script>
const W = window.innerWidth, H = window.innerHeight;
const canvas = document.createElement('canvas');
canvas.width = W; canvas.height = H;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const cx = W / 2, cy = H / 2;
const R = Math.min(W, H) * 0.44;

function draw(t) {
  ctx.clearRect(0, 0, W, H);

  // ── Sphere base ──────────────────────────────────────────────────────────
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();

  const base = ctx.createRadialGradient(
    cx - R * 0.3, cy - R * 0.3, R * 0.05,
    cx + R * 0.1, cy + R * 0.1, R * 1.1
  );
  base.addColorStop(0,   '#1e4d7a');
  base.addColorStop(0.45,'#12305a');
  base.addColorStop(1,   '#060e1e');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // ── Longitude lines (animated) ───────────────────────────────────────────
  ctx.strokeStyle = 'rgba(80,160,220,0.18)';
  ctx.lineWidth = 0.8;
  const nLon = 12;
  for (let i = 0; i < nLon; i++) {
    const phase = (i / nLon) * Math.PI * 2 + t * 0.25;
    const cosP = Math.cos(phase);
    const rx = Math.abs(cosP) * R;
    if (rx < 1) continue;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, R, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ── Latitude lines ────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(80,160,220,0.12)';
  ctx.lineWidth = 0.6;
  const nLat = 7;
  for (let i = 1; i < nLat; i++) {
    const lat = (i / nLat) * Math.PI - Math.PI / 2;
    const ry = Math.cos(lat) * R;
    const yOff = Math.sin(lat) * R;
    ctx.beginPath();
    ctx.ellipse(cx, cy + yOff, ry, ry * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();

  // ── Atmosphere glow ───────────────────────────────────────────────────────
  const atmo = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, R * 1.18);
  atmo.addColorStop(0,   'rgba(40,100,220,0.10)');
  atmo.addColorStop(0.5, 'rgba(30,80,180,0.05)');
  atmo.addColorStop(1,   'rgba(20,60,160,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.18, 0, Math.PI * 2);
  ctx.fillStyle = atmo;
  ctx.fill();

  // ── Specular highlight ────────────────────────────────────────────────────
  const spec = ctx.createRadialGradient(
    cx - R * 0.38, cy - R * 0.38, 0,
    cx - R * 0.2,  cy - R * 0.2,  R * 0.55
  );
  spec.addColorStop(0, 'rgba(180,220,255,0.14)');
  spec.addColorStop(1, 'rgba(180,220,255,0)');
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = spec;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}

let t = 0;
function animate() {
  draw(t);
  t += 0.008;
  requestAnimationFrame(animate);
}
animate();
</script>
</body>
</html>`;

export default function Globe() {
  return (
    <View style={styles.container} pointerEvents="none">
      <WebView
        style={styles.webview}
        source={{ html: HTML }}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        originWhitelist={["*"]}
        javaScriptEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  webview: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
});
