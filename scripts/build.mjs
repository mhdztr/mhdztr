// Generates every SVG in assets/ (light + dark). Run: node scripts/build.mjs
import { writeFileSync, readdirSync, unlinkSync } from "node:fs";

const themes = {
  light: { bg: "#EEF1E8", surface: "#E0E6D3", ink: "#0F2A20", muted: "#4C6256", accent: "#0F2A20", pop: "#C6F432", onPop: "#0F2A20" },
  dark:  { bg: "#0D1712", surface: "#16241C", ink: "#E8EFDC", muted: "#8DA396", accent: "#C6F432", pop: "#C6F432", onPop: "#0D1712" },
};
const SANS = "'Helvetica Neue','Segoe UI',Helvetica,Arial,'Liberation Sans',sans-serif";

for (const f of readdirSync("assets")) unlinkSync("assets/" + f);

const hero = (t) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 380" width="1200" height="380" role="img" aria-label="Zakki Thoriq, software developer">
<style>
text{font-family:${SANS}}
.f1{animation:fl 7s ease-in-out infinite}.f2{animation:fl 9s ease-in-out -3s infinite}.f3{animation:fl 8s ease-in-out -5s infinite}
@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@media (prefers-reduced-motion:reduce){.f1,.f2,.f3{animation:none}}
</style>
<rect width="1200" height="380" rx="28" fill="${t.bg}"/>
<g transform="translate(790 0)">
  <g class="f1"><circle cx="150" cy="130" r="92" fill="${t.pop}"/></g>
  <g class="f2"><rect x="215" y="150" width="170" height="170" rx="40" fill="${t.surface}"/><circle cx="300" cy="235" r="34" fill="none" stroke="${t.ink}" stroke-width="10"/></g>
  <g class="f3"><rect x="20" y="215" width="170" height="90" rx="45" fill="${t.ink}"/><circle cx="145" cy="260" r="24" fill="${t.pop}"/></g>
</g>
<text x="64" y="74" font-size="22" font-weight="600" fill="${t.muted}" letter-spacing="1">HELLO, I'M</text>
<text x="60" y="170" font-size="104" font-weight="800" letter-spacing="-4" fill="${t.ink}">Zakki</text>
<text x="60" y="266" font-size="104" font-weight="800" letter-spacing="-4" fill="${t.ink}">Thoriq<tspan fill="${t.pop}">.</tspan></text>
<text x="64" y="336" font-size="24" fill="${t.muted}">I build software, mostly small, mostly useful.</text>
</svg>`;

const tile = (t, { n, name, line, tag, hot }) => {
  const bg = hot ? t.pop : t.surface, ink = hot ? t.onPop : t.ink, mut = hot ? t.onPop : t.muted;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 260" width="580" height="260" role="img" aria-label="${name}: ${line}">
<style>text{font-family:${SANS}}.ar{transition:transform .2s}</style>
<rect width="580" height="260" rx="24" fill="${bg}"/>
<text x="36" y="58" font-size="18" font-weight="700" fill="${mut}" opacity=".75">${n}</text>
<text x="34" y="132" font-size="58" font-weight="800" letter-spacing="-2" fill="${ink}">${name}</text>
<text x="36" y="170" font-size="21" fill="${mut}">${line}</text>
<rect x="36" y="198" width="${tag.length * 11 + 32}" height="34" rx="17" fill="none" stroke="${ink}" stroke-width="1.8" opacity=".8"/>
<text x="52" y="221" font-size="14" font-weight="700" letter-spacing="1.2" fill="${ink}">${tag}</text>
<circle cx="520" cy="56" r="26" fill="${hot ? t.onPop : t.ink}"/>
<path d="M512 64 L528 48 M514 48 H528 V62" stroke="${hot ? t.pop : t.bg}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
};

const band = (t) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" width="1200" height="120" role="img" aria-label="Rust, Java, JavaScript">
<style>text{font-family:${SANS}}</style>
<rect width="1200" height="120" rx="28" fill="${t.pop}"/>
<text x="600" y="78" text-anchor="middle" font-size="46" font-weight="800" letter-spacing="-1" fill="${t.onPop}">Rust  ·  Java  ·  JavaScript</text>
</svg>`;

const projects = [
  { n: "01", name: "smelt", line: "Convert any document to any other.", tag: "RUST · CLI", hot: true },
  { n: "02", name: "sonora", line: "A desktop music player.", tag: "JAVA · DESKTOP" },
  { n: "03", name: "sweep", line: "Storage cleaning that asks first.", tag: "RUST · LINUX" },
  { n: "04", name: "Nakhoda", line: "Crew management on the web.", tag: "JAVASCRIPT · WEB" },
];

for (const [k, t] of Object.entries(themes)) {
  writeFileSync(`assets/hero-${k}.svg`, hero(t));
  writeFileSync(`assets/band-${k}.svg`, band(t));
  projects.forEach((p, i) => writeFileSync(`assets/tile-${i + 1}-${k}.svg`, tile(t, p)));
}
