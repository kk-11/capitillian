import React from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

// Renders a spinning textured earth using 2D canvas pixel projection.
// No external JS libraries — texture loaded from GitHub raw CDN (CORS: *).
const HTML = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
  *{margin:0;padding:0}
  html,body{width:100%;height:100%;overflow:hidden;background:#0a0a0a}
  canvas{display:block;image-rendering:auto}
</style>
</head>
<body>
<script>
const W = window.innerWidth, H = window.innerHeight;

// Render at half resolution for performance, CSS-upscaled with smoothing
const S = 0.5;
const cw = Math.floor(W * S), ch = Math.floor(H * S);

const canvas = document.createElement('canvas');
canvas.width = cw; canvas.height = ch;
canvas.style.width = W + 'px';
canvas.style.height = H + 'px';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const cx = cw / 2, cy = ch / 2;
const R = Math.min(cw, ch) * 0.44;
const R2 = R * R;

// Texture (equirectangular earth night map)
let texPx = null, texW = 0, texH = 0;
const img = new Image();
img.crossOrigin = 'anonymous';
img.onload = () => {
  const tc = document.createElement('canvas');
  tc.width = 512; tc.height = 256;
  const tctx = tc.getContext('2d');
  tctx.drawImage(img, 0, 0, 512, 256);
  const d = tctx.getImageData(0, 0, 512, 256);
  texPx = d.data; texW = 512; texH = 256;
};
img.src = 'https://raw.githubusercontent.com/kk-11/eusi/master/src/assets/earth-night.jpg';

// Light direction (normalised)
const LX = -0.4, LY = 0.5, LZ = 0.77;

let t = 0;

function draw() {
  const imgData = ctx.createImageData(cw, ch);
  const pix = imgData.data;

  const xMin = Math.max(0, Math.floor(cx - R) - 1);
  const xMax = Math.min(cw - 1, Math.ceil(cx + R) + 1);
  const yMin = Math.max(0, Math.floor(cy - R) - 1);
  const yMax = Math.min(ch - 1, Math.ceil(cy + R) + 1);

  for (let py = yMin; py <= yMax; py++) {
    const dy = py - cy;
    const dy2 = dy * dy;
    for (let px = xMin; px <= xMax; px++) {
      const dx = px - cx;
      if (dx * dx + dy2 > R2) continue;

      // Sphere surface normal (Y up = north)
      const nx =  dx / R;
      const ny = -dy / R;
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));

      let cr, cg, cb;

      if (texPx) {
        const lat = Math.asin(Math.max(-1, Math.min(1, ny)));
        const lon = Math.atan2(nx, nz) - t;
        const tx = ((lon / (Math.PI * 2) + 0.5) % 1 + 1) % 1;
        const ty = 0.5 - lat / Math.PI;
        const ti = (Math.min(texH - 1, ty * texH | 0) * texW +
                    Math.min(texW - 1, tx * texW | 0)) * 4;
        const light = 0.12 + Math.max(0, nx * LX + ny * LY + nz * LZ) * 0.88;
        cr = texPx[ti]     * light;
        cg = texPx[ti + 1] * light;
        cb = texPx[ti + 2] * light;
      } else {
        // Blue fallback while texture loads
        const light = 0.2 + Math.max(0, nx * LX + ny * LY + nz * LZ) * 0.8;
        cr = 20 * light; cg = 70 * light; cb = 150 * light;
      }

      const i = (py * cw + px) * 4;
      pix[i]     = cr < 255 ? cr : 255;
      pix[i + 1] = cg < 255 ? cg : 255;
      pix[i + 2] = cb < 255 ? cb : 255;
      pix[i + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Atmosphere glow drawn on top
  const atmo = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, R * 1.18);
  atmo.addColorStop(0,   'rgba(40,110,230,0.18)');
  atmo.addColorStop(0.5, 'rgba(30, 80,200,0.08)');
  atmo.addColorStop(1,   'rgba(20, 60,180,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.18, 0, Math.PI * 2);
  ctx.fillStyle = atmo;
  ctx.fill();

  t += 0.004;
}

(function loop() { draw(); requestAnimationFrame(loop); })();
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
