// Social preview images (1280x640) in the Black, White & Silver palette. Run: node scripts/social.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
const cfg = JSON.parse(readFileSync("config.json", "utf8"));
const SANS = "'Helvetica Neue','Segoe UI',Helvetica,Arial,'Liberation Sans',sans-serif";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
mkdirSync("social", { recursive: true });

for (const [name, info] of Object.entries(cfg.repoMeta || {})) {
  const size = name.length <= 8 ? 160 : name.length <= 12 ? 120 : 90;
  const tag = info.topics && info.topics.length ? (info.topics[0][0].toUpperCase() + info.topics[0].slice(1)) : "Project";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" width="1280" height="640">
<style>text{font-family:${SANS}}</style>
<rect width="1280" height="640" fill="#0A0A0C"/>
<circle cx="1060" cy="180" r="160" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" stroke-dasharray="6 8"/>
<rect x="960" y="320" width="220" height="220" rx="44" fill="#141416" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
<circle cx="1070" cy="430" r="40" fill="none" stroke="#D1D1D6" stroke-width="3"/>
<circle cx="1070" cy="430" r="8" fill="#D1D1D6"/>
<text x="80" y="120" font-size="24" font-weight="600" letter-spacing="1" fill="#D1D1D6">${esc(tag)}</text>
<text x="76" y="320" font-size="${size}" font-weight="700" letter-spacing="-4" fill="#F2F2F5">${esc(name)}</text>
<text x="80" y="410" font-size="32" font-weight="400" fill="#8A8A93">${esc(info.description)}</text>
<text x="80" y="560" font-size="24" font-weight="500" fill="#D1D1D6">github.com/${cfg.user}</text>
</svg>`;
  writeFileSync(`social/${name}.svg`, svg);
  try { execFileSync("rsvg-convert", [`social/${name}.svg`, "-o", `social/${name}.png`]); } catch { console.warn("rsvg-convert missing; SVG only"); }
}
console.log("Social preview images generated in B&W + Silver");
