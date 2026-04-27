#!/usr/bin/env node
// Generates icon.png (default) and all alternate icon PNGs from SVG templates.
// Usage: node scripts/generate-icons.js

const { Resvg } = require("@resvg/resvg-js");
const fs = require("fs");
const path = require("path");

const ASSETS = path.join(__dirname, "..", "assets");
const ICONS  = path.join(ASSETS, "icons");
const SIZE   = 1024;

// Base SVG template — parameterised by globeColor and dotColor
function makeSVG(globeColor, dotColor) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
<defs>
  <filter id="g1" x="-40%" y="-40%" width="180%" height="180%">
    <feGaussianBlur stdDeviation="5" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="g2" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="14" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="g3" x="-150%" y="-150%" width="400%" height="400%">
    <feGaussianBlur stdDeviation="28" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="gblur" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="10"/>
  </filter>
  <radialGradient id="bg" cx="50%" cy="46%" r="62%">
    <stop offset="0%"   stop-color="#0F1A2C"/>
    <stop offset="100%" stop-color="#060810"/>
  </radialGradient>
  <radialGradient id="atm" cx="50%" cy="50%" r="50%">
    <stop offset="70%"  stop-color="${globeColor}" stop-opacity="0"/>
    <stop offset="100%" stop-color="${globeColor}" stop-opacity="0.14"/>
  </radialGradient>
  <clipPath id="gc"><circle cx="512" cy="502" r="300"/></clipPath>
</defs>

<rect width="1024" height="1024" fill="url(#bg)"/>
<circle cx="512" cy="502" r="315" fill="url(#atm)"/>

<g clip-path="url(#gc)" fill="none" stroke="${globeColor}" stroke-linecap="round">
  <ellipse cx="512" cy="502" rx="300" ry="56"  stroke-width="1.4" opacity="0.65"/>
  <ellipse cx="512" cy="352" rx="260" ry="50"  stroke-width="1.1" opacity="0.45"/>
  <ellipse cx="512" cy="652" rx="260" ry="50"  stroke-width="1.1" opacity="0.45"/>
  <ellipse cx="512" cy="242" rx="150" ry="29"  stroke-width="0.9" opacity="0.28"/>
  <ellipse cx="512" cy="762" rx="150" ry="29"  stroke-width="0.9" opacity="0.28"/>
  <ellipse cx="512" cy="502" rx="52"  ry="300" stroke-width="1.1" opacity="0.45"/>
  <ellipse cx="512" cy="502" rx="212" ry="300" stroke-width="0.9" opacity="0.30"/>
</g>

<circle cx="512" cy="502" r="300" fill="none" stroke="${globeColor}" stroke-width="6"   opacity="0.15" filter="url(#gblur)"/>
<circle cx="512" cy="502" r="300" fill="none" stroke="${globeColor}" stroke-width="1.8" opacity="0.90" filter="url(#g1)"/>

<line x1="212" y1="502" x2="812" y2="502" stroke="${globeColor}" stroke-width="0.7" opacity="0.30"/>
<line x1="512" y1="202" x2="512" y2="802" stroke="${globeColor}" stroke-width="0.7" opacity="0.30"/>

<line x1="512" y1="192" x2="512" y2="216" stroke="${globeColor}" stroke-width="2.5" opacity="0.80" filter="url(#g1)"/>
<line x1="512" y1="788" x2="512" y2="812" stroke="${globeColor}" stroke-width="2.5" opacity="0.80" filter="url(#g1)"/>
<line x1="192" y1="502" x2="216" y2="502" stroke="${globeColor}" stroke-width="2.5" opacity="0.80" filter="url(#g1)"/>
<line x1="808" y1="502" x2="832" y2="502" stroke="${globeColor}" stroke-width="2.5" opacity="0.80" filter="url(#g1)"/>

<g fill="none" stroke="#FFFFFF" stroke-width="1.8" opacity="0.45" stroke-linecap="square">
  <path d="M497,195 L497,183 L527,183 L527,195"/>
  <path d="M497,809 L497,821 L527,821 L527,809"/>
  <path d="M195,487 L183,487 L183,517 L195,517"/>
  <path d="M829,487 L841,487 L841,517 L829,517"/>
</g>

<line x1="502" y1="502" x2="522" y2="502" stroke="#FFFFFF" stroke-width="1.5" opacity="0.55"/>
<line x1="512" y1="492" x2="512" y2="512" stroke="#FFFFFF" stroke-width="1.5" opacity="0.55"/>
<circle cx="512" cy="502" r="4" fill="none" stroke="#FFFFFF" stroke-width="1.3" opacity="0.45"/>

<circle cx="572" cy="317" r="38"  fill="${dotColor}" opacity="0.08" filter="url(#g3)"/>
<circle cx="572" cy="317" r="20"  fill="${dotColor}" opacity="0.30" filter="url(#g2)"/>
<circle cx="572" cy="317" r="9"   fill="${dotColor}" filter="url(#g1)"/>
<circle cx="572" cy="317" r="3.5" fill="#FFFFFF"/>

<g fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.18" stroke-linecap="square">
  <path d="M52,92 L52,52 L92,52"/>
  <path d="M932,52 L972,52 L972,92"/>
  <path d="M52,932 L52,972 L92,972"/>
  <path d="M972,932 L972,972 L932,972"/>
</g>
</svg>`;
}

function render(svg, outPath) {
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: SIZE } });
  const png = resvg.render().asPng();
  fs.writeFileSync(outPath, png);
  console.log(`✓ ${path.relative(process.cwd(), outPath)}`);
}

// Default icon
render(
  makeSVG("#8BBCCC", "#D4A87A"),
  path.join(ASSETS, "icon.png")
);

// Alternate icons
const variants = [
  { name: "match-bronze", globe: "#C08040", dot: "#CD7F32" },
  { name: "match-silver", globe: "#A0B8CC", dot: "#B8C8D8" },
  { name: "match-gold",   globe: "#C8A820", dot: "#FFD700" },
  { name: "mine-bronze",  globe: "#C04030", dot: "#CD7F32" },
  { name: "mine-silver",  globe: "#C04030", dot: "#C0C0C0" },
  { name: "mine-gold",    globe: "#C04030", dot: "#FFD700" },
];

for (const v of variants) {
  render(
    makeSVG(v.globe, v.dot),
    path.join(ICONS, `${v.name}.png`)
  );
}
