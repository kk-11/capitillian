import React, { useRef, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

type GlobeProps = {
  targetLat?: number;
  targetLng?: number;
};

// Renders a spinning textured earth using 2D canvas pixel projection.
// Supports smooth zoom + rotation to a target lat/lng via injectJavaScript.
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
const S = 0.5;
const cw = Math.floor(W * S), ch = Math.floor(H * S);

const canvas = document.createElement('canvas');
canvas.width = cw; canvas.height = ch;
canvas.style.width = W + 'px';
canvas.style.height = H + 'px';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

const cx = cw / 2, cy = ch / 2;
const R  = Math.min(cw, ch) * 0.44;
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

// Fixed light direction (screen space)
const LX = -0.4, LY = 0.5, LZ = 0.77;

// ---------------------------------------------------------------------------
// Animation state
// Phases: 'spin' | 'zoom-out' | 'zoom-in' | 'idle'
// ---------------------------------------------------------------------------
let phase        = 'spin';
let currentLon   = 0;     // longitude rotation offset (radians)
let currentTilt  = 0;     // latitude tilt (radians); tilt = -latRad centres lat
let currentZoom  = 1.0;   // >1 = zoomed in, <1 = zoomed out

let targetLon    = 0;
let targetTilt   = 0;
let pendingLon   = null;
let pendingTilt  = null;

const ZOOM_IN  = 1.65;
const ZOOM_OUT = 0.82;

function normLon(d) {
  while (d >  Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

function log(msg) {
  window.ReactNativeWebView && window.ReactNativeWebView.postMessage('[Globe] ' + msg);
}

function commitPending() {
  targetLon  = pendingLon;
  targetTilt = pendingTilt;
  pendingLon = pendingTilt = null;
  phase      = 'zoom-out';
  log('commitPending -> zoom-out targetLon=' + targetLon.toFixed(3) + ' targetTilt=' + targetTilt.toFixed(3));
}

// Called by React Native to point the globe at a capital city.
// Works from any phase — globe zooms out, rotates, zooms back in.
window.setTarget = function(lat, lng) {
  log('setTarget called lat=' + lat + ' lng=' + lng + ' phase=' + phase);
  pendingLon  = -(lng * Math.PI / 180);
  pendingTilt = -(lat * Math.PI / 180);
  if (phase === 'spin' || phase === 'idle' || phase === 'zoom-in') {
    commitPending();
  }
  // If already zooming out, pending values are picked up at the bottom of zoom-out
};

function updateAnim() {
  if (phase === 'spin') {
    currentLon += 0.004;
    return;
  }

  if (phase === 'zoom-out') {
    currentZoom += (ZOOM_OUT - currentZoom) * 0.13;
    if (Math.abs(currentZoom - ZOOM_OUT) < 0.012) {
      currentZoom = ZOOM_OUT;
      // If a new target arrived while zooming out, use it
      if (pendingLon !== null) {
        targetLon  = pendingLon;
        targetTilt = pendingTilt;
        pendingLon = pendingTilt = null;
      }
      phase = 'zoom-in';
    }
    return;
  }

  if (phase === 'zoom-in') {
    // Zoom towards country
    currentZoom += (ZOOM_IN - currentZoom) * 0.08;
    // Rotate to target (shortest path on longitude)
    currentLon  += normLon(targetLon  - currentLon)  * 0.10;
    currentTilt += (targetTilt - currentTilt) * 0.10;

    // New target arrived — restart transition
    if (pendingLon !== null) {
      phase = 'zoom-out';
      return;
    }

    if (Math.abs(currentZoom - ZOOM_IN) < 0.015) {
      currentZoom = ZOOM_IN;
      phase = 'idle';
    }
    return;
  }

  if (phase === 'idle') {
    // Softly lock onto target
    currentLon  += normLon(targetLon  - currentLon)  * 0.06;
    currentTilt += (targetTilt - currentTilt) * 0.06;
    if (pendingLon !== null) commitPending();
  }
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------
function draw() {
  updateAnim();

  const imgData = ctx.createImageData(cw, ch);
  const pix = imgData.data;

  const effR = R * currentZoom;  // effective sphere radius for texture sampling

  const xMin = Math.max(0, Math.floor(cx - R) - 1);
  const xMax = Math.min(cw - 1, Math.ceil(cx + R) + 1);
  const yMin = Math.max(0, Math.floor(cy - R) - 1);
  const yMax = Math.min(ch - 1, Math.ceil(cy + R) + 1);

  // Precompute tilt trig for this frame
  const cosT = Math.cos(currentTilt);
  const sinT = Math.sin(currentTilt);

  for (let py = yMin; py <= yMax; py++) {
    const dy  = py - cy;
    const dy2 = dy * dy;
    for (let px = xMin; px <= xMax; px++) {
      const dx = px - cx;
      if (dx * dx + dy2 > R2) continue;

      // Project pixel onto sphere surface using effective (zoomed) radius
      const nx   =  dx / effR;
      const ny_s = -dy / effR;
      const nzSq = 1 - nx * nx - ny_s * ny_s;

      const i = (py * cw + px) * 4;

      if (nzSq < 0) {
        // Inside sphere silhouette but outside zoomed surface — show dark space
        pix[i] = 6; pix[i+1] = 6; pix[i+2] = 12; pix[i+3] = 255;
        continue;
      }
      const nz_s = Math.sqrt(nzSq);

      // Apply latitude tilt: rotate (ny_s, nz_s) around x-axis by currentTilt
      const ny = ny_s * cosT - nz_s * sinT;
      const nz = ny_s * sinT + nz_s * cosT;

      let cr, cg, cb;

      if (texPx) {
        const lat = Math.asin(Math.max(-1, Math.min(1, ny)));
        const lon = Math.atan2(nx, nz) - currentLon;
        const tx  = ((lon / (Math.PI * 2) + 0.5) % 1 + 1) % 1;
        const ty  = 0.5 - lat / Math.PI;
        const ti  = (Math.min(texH - 1, ty * texH | 0) * texW +
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

      pix[i]     = cr < 255 ? cr : 255;
      pix[i + 1] = cg < 255 ? cg : 255;
      pix[i + 2] = cb < 255 ? cb : 255;
      pix[i + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Atmosphere glow drawn on top of sphere
  const atmo = ctx.createRadialGradient(cx, cy, R * 0.88, cx, cy, R * 1.18);
  atmo.addColorStop(0,   'rgba(40,110,230,0.18)');
  atmo.addColorStop(0.5, 'rgba(30, 80,200,0.08)');
  atmo.addColorStop(1,   'rgba(20, 60,180,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, R * 1.18, 0, Math.PI * 2);
  ctx.fillStyle = atmo;
  ctx.fill();
}

(function loop() { draw(); requestAnimationFrame(loop); })();
</script>
</body>
</html>`;

export default function Globe({ targetLat, targetLng }: GlobeProps) {
  const webviewRef = useRef<WebView>(null);

  // Zoom/rotate to the selected country's capital
  useEffect(() => {
    if (targetLat !== undefined && targetLng !== undefined) {
      webviewRef.current?.injectJavaScript(`setTarget(${targetLat}, ${targetLng}); true;`);
    }
  }, [targetLat, targetLng]);

  return (
    <View style={styles.container} pointerEvents="none">
      <WebView
        ref={webviewRef}
        style={styles.webview}
        source={{ html: HTML }}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        originWhitelist={["*"]}
        javaScriptEnabled
        onMessage={(e) => console.log(e.nativeEvent.data)}
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
