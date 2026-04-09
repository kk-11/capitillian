import React, { useRef, useEffect } from "react";
import { StyleSheet, View, Animated } from "react-native";
import WebView from "react-native-webview";

type GlobeProps = {
  targetLat?: number;
  targetLng?: number;
  interactive?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onGlobeTap?: (lat: number, lon: number) => void;
  highlightCode?: string | null;
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
<script src="https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js"></script>
</head>
<body>
<script>
const W = window.innerWidth, H = window.innerHeight;
const S = 1.0;
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

// ---------------------------------------------------------------------------
// Texture
// ---------------------------------------------------------------------------
let texPx = null, texW = 0, texH = 0;
const img = new Image();
img.crossOrigin = 'anonymous';
img.onload = () => {
  const tc = document.createElement('canvas');
  tc.width = 1024; tc.height = 512;
  const tctx = tc.getContext('2d');
  tctx.drawImage(img, 0, 0, 1024, 512);
  const d = tctx.getImageData(0, 0, 1024, 512);
  texPx = d.data; texW = 1024; texH = 512;
};
img.src = 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Whole_world_-_land_and_oceans_12000.jpg';

// ---------------------------------------------------------------------------
// Country polygon data (world-atlas + topojson)
// ---------------------------------------------------------------------------
// ISO alpha-2 → numeric code
var A2N = {
  "AF":4,"AL":8,"DZ":12,"AD":20,"AO":24,"AG":28,"AR":32,"AM":51,
  "AU":36,"AT":40,"AZ":31,"BS":44,"BH":48,"BD":50,"BB":52,"BY":112,
  "BE":56,"BZ":84,"BJ":204,"BT":64,"BO":68,"BA":70,"BW":72,"BR":76,
  "BN":96,"BG":100,"BF":854,"BI":108,"CV":132,"KH":116,"CM":120,
  "CA":124,"CF":140,"TD":148,"CL":152,"CN":156,"CO":170,"KM":174,
  "CG":178,"CD":180,"CR":188,"HR":191,"CU":192,"CY":196,"CZ":203,
  "DK":208,"DJ":262,"DM":212,"DO":214,"EC":218,"EG":818,"SV":222,
  "GQ":226,"ER":232,"EE":233,"SZ":748,"ET":231,"FJ":242,"FI":246,
  "FR":250,"GA":266,"GM":270,"GE":268,"DE":276,"GH":288,"GR":300,
  "GD":308,"GT":320,"GN":324,"GW":624,"GY":328,"HT":332,"HN":340,
  "HU":348,"IS":352,"IN":356,"ID":360,"IR":364,"IQ":368,"IE":372,
  "IL":376,"IT":380,"JM":388,"JP":392,"JO":400,"KZ":398,"KE":404,
  "KI":296,"KP":408,"KR":410,"KW":414,"KG":417,"LA":418,"LV":428,
  "LB":422,"LS":426,"LR":430,"LY":434,"LI":438,"LT":440,"LU":442,
  "MG":450,"MW":454,"MY":458,"MV":462,"ML":466,"MT":470,"MH":584,
  "MR":478,"MU":480,"MX":484,"FM":583,"MD":498,"MC":492,"MN":496,
  "ME":499,"MA":504,"MZ":508,"MM":104,"NA":516,"NR":520,"NP":524,
  "NL":528,"NZ":554,"NI":558,"NE":562,"NG":566,"MK":807,"NO":578,
  "OM":512,"PK":586,"PW":585,"PA":591,"PG":598,"PY":600,"PE":604,
  "PH":608,"PL":616,"PT":620,"QA":634,"RO":642,"RU":643,"RW":646,
  "KN":659,"LC":662,"VC":670,"WS":882,"SM":674,"ST":678,"SA":682,
  "SN":686,"RS":688,"SC":690,"SL":694,"SG":702,"SK":703,"SI":705,
  "SB":90,"SO":706,"ZA":710,"SS":728,"ES":724,"LK":144,"SD":729,
  "SR":740,"SE":752,"CH":756,"SY":760,"TW":158,"TJ":762,"TZ":834,
  "TH":764,"TL":626,"TG":768,"TO":776,"TT":780,"TN":788,"TR":792,
  "TM":795,"TV":798,"UG":800,"UA":804,"AE":784,"GB":826,"US":840,
  "UY":858,"UZ":860,"VU":548,"VE":862,"VN":704,"YE":887,"ZM":894,"ZW":716
};

var countriesGeo = null;
var hlFeature = null, hlAlpha = 0, hlExtrusion = 0;

fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
  .then(function(r) { return r.json(); })
  .then(function(world) {
    if (typeof topojson !== 'undefined') {
      countriesGeo = topojson.feature(world, world.objects.countries).features;
    }
  })
  .catch(function() {});

window.setHighlight = function(code) {
  hlAlpha = 0; hlExtrusion = 0;
  if (!code || !countriesGeo) { hlFeature = null; return; }
  var num = A2N[code];
  if (num === undefined) { hlFeature = null; return; }
  hlFeature = null;
  for (var i = 0; i < countriesGeo.length; i++) {
    if (countriesGeo[i].id == num) { hlFeature = countriesGeo[i]; break; }
  }
};

// Project a lat/lng point onto the canvas, optionally extruded above the sphere.
function projectPt(lat, lng, extrusion) {
  var lr = lat * Math.PI / 180;
  var lonAdj = lng * Math.PI / 180 + currentLon;
  var nxw = Math.cos(lr) * Math.sin(lonAdj);
  var nyw = Math.sin(lr);
  var nzw = Math.cos(lr) * Math.cos(lonAdj);
  var cosT = Math.cos(currentTilt);
  var sinT = Math.sin(currentTilt);
  var nys = nyw * cosT + nzw * sinT;
  var nzs = -nyw * sinT + nzw * cosT;
  var nxs = nxw;
  if (nzs <= 0) return null;
  var scale = R * currentZoom * (1 + extrusion);
  return [cx + nxs * scale, cy - nys * scale];
}

function drawHighlight() {
  if (!hlFeature) return;
  hlAlpha    = Math.min(1,    hlAlpha    + 0.05);
  hlExtrusion = Math.min(0.07, hlExtrusion + 0.005);

  var geom = hlFeature.geometry;
  if (!geom) return;
  var polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;

  ctx.save();

  // Fill
  ctx.fillStyle = '#ffd050';
  ctx.globalAlpha = hlAlpha * 0.28;
  for (var pi = 0; pi < polys.length; pi++) {
    var ring = polys[pi][0];
    ctx.beginPath();
    var started = false;
    for (var vi = 0; vi < ring.length; vi++) {
      var pt = projectPt(ring[vi][1], ring[vi][0], hlExtrusion);
      if (!pt) { started = false; continue; }
      if (!started) { ctx.moveTo(pt[0], pt[1]); started = true; }
      else ctx.lineTo(pt[0], pt[1]);
    }
    ctx.closePath();
    ctx.fill();
  }

  // Border
  ctx.strokeStyle = '#ffe580';
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  ctx.globalAlpha = hlAlpha * 0.95;
  for (var pi2 = 0; pi2 < polys.length; pi2++) {
    var ring2 = polys[pi2][0];
    ctx.beginPath();
    var started2 = false;
    for (var vi2 = 0; vi2 < ring2.length; vi2++) {
      var pt2 = projectPt(ring2[vi2][1], ring2[vi2][0], hlExtrusion);
      if (!pt2) { started2 = false; continue; }
      if (!started2) { ctx.moveTo(pt2[0], pt2[1]); started2 = true; }
      else ctx.lineTo(pt2[0], pt2[1]);
    }
    ctx.stroke();
  }

  ctx.restore();
}

// ---------------------------------------------------------------------------
// Animation state
// Phases: 'spin' | 'pan' | 'idle'
// ---------------------------------------------------------------------------
let phase        = 'spin';
let currentLon   = 0;
let currentTilt  = 0;
let currentZoom  = 1.0;

let targetLon    = 0;
let targetTilt   = 0;
let pendingLon   = null;
let pendingTilt  = null;

const ZOOM_IN = 1.65;
const LX = -0.4, LY = 0.5, LZ = 0.77;

function normLon(d) {
  while (d >  Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
}

function commitPending() {
  targetLon  = pendingLon;
  targetTilt = pendingTilt;
  pendingLon = pendingTilt = null;
  phase      = 'pan';
}

window.setTarget = function(lat, lng) {
  pendingLon  = -(lng * Math.PI / 180);
  pendingTilt = -(lat * Math.PI / 180);
  commitPending();
};

function updateAnim() {
  if (phase === 'spin') { currentLon += 0.004; return; }
  if (phase === 'pan') {
    currentZoom += (ZOOM_IN - currentZoom) * 0.10;
    currentLon  += normLon(targetLon  - currentLon)  * 0.12;
    currentTilt += (targetTilt - currentTilt) * 0.12;
    if (pendingLon !== null) { targetLon = pendingLon; targetTilt = pendingTilt; pendingLon = pendingTilt = null; }
    if (Math.abs(normLon(targetLon - currentLon)) < 0.005 &&
        Math.abs(targetTilt - currentTilt) < 0.005 &&
        Math.abs(currentZoom - ZOOM_IN) < 0.005) {
      currentZoom = ZOOM_IN; phase = 'idle';
    }
    return;
  }
  if (phase === 'idle') {
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
  const effR = R * currentZoom;
  const xMin = Math.max(0, Math.floor(cx - R) - 1);
  const xMax = Math.min(cw - 1, Math.ceil(cx + R) + 1);
  const yMin = Math.max(0, Math.floor(cy - R) - 1);
  const yMax = Math.min(ch - 1, Math.ceil(cy + R) + 1);
  const cosT = Math.cos(currentTilt);
  const sinT = Math.sin(currentTilt);

  for (let py = yMin; py <= yMax; py++) {
    const dy  = py - cy;
    const dy2 = dy * dy;
    for (let px = xMin; px <= xMax; px++) {
      const dx = px - cx;
      if (dx * dx + dy2 > R2) continue;
      const nx   =  dx / effR;
      const ny_s = -dy / effR;
      const nzSq = 1 - nx * nx - ny_s * ny_s;
      const i = (py * cw + px) * 4;
      if (nzSq < 0) { pix[i]=6; pix[i+1]=6; pix[i+2]=12; pix[i+3]=255; continue; }
      const nz_s = Math.sqrt(nzSq);
      const ny = ny_s * cosT - nz_s * sinT;
      const nz = ny_s * sinT + nz_s * cosT;
      let cr, cg, cb;
      if (texPx) {
        const lat = Math.asin(Math.max(-1, Math.min(1, ny)));
        const lon = Math.atan2(nx, nz) - currentLon;
        const tx  = ((lon / (Math.PI * 2) + 0.5) % 1 + 1) % 1;
        const ty  = 0.5 - lat / Math.PI;
        const ti  = (Math.min(texH-1, ty*texH|0) * texW + Math.min(texW-1, tx*texW|0)) * 4;
        const light = 0.12 + Math.max(0, nx*LX + ny*LY + nz*LZ) * 0.88;
        cr = texPx[ti]*light; cg = texPx[ti+1]*light; cb = texPx[ti+2]*light;
      } else {
        const light = 0.2 + Math.max(0, nx*LX + ny*LY + nz*LZ) * 0.8;
        cr=20*light; cg=70*light; cb=150*light;
      }
      pix[i]=cr<255?cr:255; pix[i+1]=cg<255?cg:255; pix[i+2]=cb<255?cb:255; pix[i+3]=255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Country polygon highlight
  drawHighlight();

  // Atmosphere glow
  const atmo = ctx.createRadialGradient(cx, cy, R*0.88, cx, cy, R*1.18);
  atmo.addColorStop(0,   'rgba(40,110,230,0.18)');
  atmo.addColorStop(0.5, 'rgba(30,80,200,0.08)');
  atmo.addColorStop(1,   'rgba(20,60,180,0)');
  ctx.beginPath();
  ctx.arc(cx, cy, R*1.18, 0, Math.PI*2);
  ctx.fillStyle = atmo;
  ctx.fill();
}

(function loop() { draw(); requestAnimationFrame(loop); })();

// ---------------------------------------------------------------------------
// Touch interaction (drag to rotate, pinch to zoom)
// ---------------------------------------------------------------------------
let isDragging = false;
let startTX = 0, startTY = 0, startTime = 0;
let lastTX = 0, lastTY = 0;
let pinchDist0 = 0;

canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  if (e.touches.length === 1) {
    isDragging = true;
    startTX = lastTX = e.touches[0].clientX;
    startTY = lastTY = e.touches[0].clientY;
    startTime = Date.now();
    if (phase === 'spin') { phase = 'idle'; targetLon = currentLon; targetTilt = currentTilt; }
  } else if (e.touches.length === 2) {
    isDragging = false;
    var dx = e.touches[0].clientX - e.touches[1].clientX;
    var dy = e.touches[0].clientY - e.touches[1].clientY;
    pinchDist0 = Math.sqrt(dx*dx + dy*dy);
  }
}, {passive: false});

canvas.addEventListener('touchmove', function(e) {
  e.preventDefault();
  if (e.touches.length === 1 && isDragging) {
    var dx = e.touches[0].clientX - lastTX;
    var dy = e.touches[0].clientY - lastTY;
    currentLon  += dx * 0.010;
    currentTilt -= dy * 0.010;
    currentTilt = Math.max(-Math.PI/2, Math.min(Math.PI/2, currentTilt));
    targetLon = currentLon; targetTilt = currentTilt;
    lastTX = e.touches[0].clientX;
    lastTY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    var dx = e.touches[0].clientX - e.touches[1].clientX;
    var dy = e.touches[0].clientY - e.touches[1].clientY;
    var dist = Math.sqrt(dx*dx + dy*dy);
    if (pinchDist0 > 0) {
      currentZoom *= dist / pinchDist0;
      currentZoom = Math.max(0.5, Math.min(3.0, currentZoom));
    }
    pinchDist0 = dist;
  }
}, {passive: false});

canvas.addEventListener('touchend', function(e) {
  isDragging = false;
  if (e.changedTouches.length === 1) {
    var dx = e.changedTouches[0].clientX - startTX;
    var dy = e.changedTouches[0].clientY - startTY;
    var dt = Date.now() - startTime;
    var dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 10 && dt < 300) {
      var tapPx = e.changedTouches[0].clientX * S;
      var tapPy = e.changedTouches[0].clientY * S;
      var tdx = tapPx - cx;
      var tdy = tapPy - cy;
      var effR = R * currentZoom;
      var tnx = tdx / effR;
      var tny_s = -tdy / effR;
      var tnzSq = 1 - tnx * tnx - tny_s * tny_s;
      if (tnzSq >= 0) {
        var tnz_s = Math.sqrt(tnzSq);
        var tny = tny_s * Math.cos(currentTilt) - tnz_s * Math.sin(currentTilt);
        var tnz = tny_s * Math.sin(currentTilt) + tnz_s * Math.cos(currentTilt);
        var tapLat = Math.asin(Math.max(-1, Math.min(1, tny))) * 180 / Math.PI;
        var tapLon = (Math.atan2(tnx, tnz) - currentLon) * 180 / Math.PI;
        tapLon = ((tapLon + 180) % 360 + 360) % 360 - 180;
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'tap', lat: tapLat, lon: tapLon })
        );
      }
    } else if (Math.abs(dx) > 80 && dt < 350 && Math.abs(dx) > Math.abs(dy) * 2) {
      window.ReactNativeWebView && window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: dx < 0 ? 'swipeLeft' : 'swipeRight' })
      );
    }
  }
});
</script>
</body>
</html>`;

export default function Globe({ targetLat, targetLng, interactive = false, onSwipeLeft, onSwipeRight, onGlobeTap, highlightCode }: GlobeProps) {
  const webviewRef = useRef<WebView>(null);
  const opacity = useRef(new Animated.Value(0)).current;

  const handleLoadEnd = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (targetLat !== undefined && targetLng !== undefined) {
      webviewRef.current?.injectJavaScript(`setTarget(${targetLat}, ${targetLng}); true;`);
    }
  }, [targetLat, targetLng]);

  useEffect(() => {
    const code = highlightCode ?? null;
    webviewRef.current?.injectJavaScript(`setHighlight(${JSON.stringify(code)}); true;`);
  }, [highlightCode]);

  const handleMessage = (e: { nativeEvent: { data: string } }) => {
    try {
      const msg = JSON.parse(e.nativeEvent.data);
      if (msg.type === "tap") onGlobeTap?.(msg.lat, msg.lon);
      else if (msg.type === "swipeLeft") onSwipeLeft?.();
      else if (msg.type === "swipeRight") onSwipeRight?.();
    } catch {
      // non-JSON debug logs
    }
  };

  return (
    <View style={styles.container} pointerEvents={interactive ? "auto" : "none"}>
      <Animated.View style={[styles.container, { opacity }]}>
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
          onMessage={handleMessage}
          onLoadEnd={handleLoadEnd}
        />
      </Animated.View>
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
