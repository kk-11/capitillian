#!/usr/bin/env node
// Generates alternate icon PNGs derived from the KAWS globe design.
// The default icon.png is the ChatGPT original — alternates use the same
// globe but with a tinted background overlay for each tier.
// Usage: node scripts/generate-icons.js

const { Resvg } = require("@resvg/resvg-js");
const fs = require("fs");
const path = require("path");

const ASSETS = path.join(__dirname, "..", "assets");
const ICONS  = path.join(ASSETS, "icons");
const SIZE   = 1024;

// Same globe SVG as icon.svg but with a customisable overlay tint on the bg
function makeSVG(bgStop0, bgStop1, bgStop2, overlayColor, overlayOpacity = 0.0) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
<defs>
  <radialGradient id="bg" cx="38%" cy="35%" r="80%">
    <stop offset="0%"   stop-color="${bgStop0}"/>
    <stop offset="50%"  stop-color="${bgStop1}"/>
    <stop offset="100%" stop-color="${bgStop2}"/>
  </radialGradient>
  <radialGradient id="ocean" cx="38%" cy="32%" r="65%">
    <stop offset="0%"   stop-color="#68C8F0"/>
    <stop offset="100%" stop-color="#2880C8"/>
  </radialGradient>
  <radialGradient id="gloss" cx="35%" cy="28%" r="45%">
    <stop offset="0%"   stop-color="#FFFFFF" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
  </radialGradient>
  <filter id="shadow" x="-20%" y="-10%" width="140%" height="150%">
    <feDropShadow dx="0" dy="28" stdDeviation="32" flood-color="#000000" flood-opacity="0.35"/>
  </filter>
  <clipPath id="gc"><circle cx="512" cy="490" r="310"/></clipPath>
</defs>

<rect width="1024" height="1024" fill="url(#bg)"/>
${overlayOpacity > 0 ? `<rect width="1024" height="1024" fill="${overlayColor}" opacity="${overlayOpacity}"/>` : ""}

<circle cx="512" cy="490" r="310" fill="#000000" opacity="0.22" filter="url(#shadow)"/>
<circle cx="512" cy="490" r="310" fill="url(#ocean)"/>

<g clip-path="url(#gc)" fill="#78C840" stroke="#5AA030" stroke-width="2">
  <path d="M220,280 C240,250 300,240 360,260 C390,270 420,290 430,320 C440,350 420,380 400,400 C370,430 330,450 300,440 C260,425 220,400 210,370 C200,340 205,305 220,280 Z"/>
  <path d="M310,460 C340,445 375,450 395,475 C415,500 420,540 410,575 C398,615 370,645 340,650 C310,652 285,630 275,600 C262,565 270,525 285,495 C295,475 305,463 310,460 Z"/>
  <path d="M510,240 C530,228 560,230 575,248 C588,264 582,288 565,300 C548,312 522,310 510,295 C498,280 498,254 510,240 Z"/>
  <path d="M530,310 C558,295 595,300 615,325 C638,355 640,400 630,440 C618,485 590,520 558,530 C526,538 495,520 480,490 C464,458 465,415 478,378 C490,345 510,320 530,310 Z"/>
  <path d="M600,220 C650,200 730,205 775,240 C810,268 820,310 805,350 C788,395 745,420 700,418 C660,415 625,390 608,355 C590,318 590,272 605,240 C606,235 602,225 600,220 Z"/>
  <path d="M680,480 C710,462 748,465 768,488 C786,510 782,545 762,562 C740,580 706,578 688,560 C668,540 665,505 680,480 Z"/>
</g>

<circle cx="512" cy="490" r="310" fill="url(#gloss)"/>
<circle cx="512" cy="490" r="310" fill="none" stroke="#1A1A2E" stroke-width="6" opacity="0.7"/>

<g stroke="#1A1A2E" stroke-width="28" stroke-linecap="round">
  <line x1="378" y1="398" x2="434" y2="454"/>
  <line x1="434" y1="398" x2="378" y2="454"/>
  <line x1="575" y1="398" x2="631" y2="454"/>
  <line x1="631" y1="398" x2="575" y2="454"/>
</g>
<path d="M410,530 Q512,610 614,530" fill="none" stroke="#1A1A2E" stroke-width="22" stroke-linecap="round"/>
</svg>`;
}

function render(svg, outPath) {
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: SIZE } });
  const png = resvg.render().asPng();
  fs.writeFileSync(outPath, png);
  console.log(`✓ ${path.relative(process.cwd(), outPath)}`);
}

const variants = [
  // match track — warm tones
  { name: "match-bronze", bg: ["#C87820", "#A05010", "#602000"], tint: "#C87820", tintOp: 0.18 },
  { name: "match-silver", bg: ["#90A8C0", "#607080", "#304050"], tint: "#B0C8D8", tintOp: 0.15 },
  { name: "match-gold",   bg: ["#E8C020", "#C08010", "#805000"], tint: "#FFD700", tintOp: 0.20 },
  // mine track — red/dark tones
  { name: "mine-bronze",  bg: ["#C04020", "#802010", "#400800"], tint: "#C04020", tintOp: 0.25 },
  { name: "mine-silver",  bg: ["#A04040", "#702030", "#3A1020"], tint: "#D06060", tintOp: 0.20 },
  { name: "mine-gold",    bg: ["#C03020", "#E08020", "#800800"], tint: "#FFD700", tintOp: 0.22 },
];

for (const v of variants) {
  render(
    makeSVG(v.bg[0], v.bg[1], v.bg[2], v.tint, v.tintOp),
    path.join(ICONS, `${v.name}.png`)
  );
}
