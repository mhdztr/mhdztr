// Social preview images (1280x640) in the profile palette. Run: node scripts/social.mjs
// Converts to PNG with rsvg-convert if available. Upload per repo: Settings > Social preview.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
const cfg = JSON.parse(readFileSync("config.json", "utf8"));
const SANS = "'Helvetica Neue','Segoe UI',Helvetica,Arial,'Liberation Sans',sans-serif";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
mkdirSync("social", { recursive: true });
for (const [name, info] of Object.entries(cfg.repoMeta || {})) {
  const size = name.length <= 8 ? 190 : name.length <= 12 ? 140 : 100;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" width="1280" height="640">
<style>text{font-family:${SANS}}</style>
<rect width="1280" height="640" fill="#0F2A20"/>
<circle cx="1090" cy="170" r="150" fill="#C6F432"/><rect x="1000" y="360" width="190" height="190" rx="48" fill="#16241C" stroke="#C6F432" stroke-width="6"/>
<text x="80" y="110" font-size="36" font-weight="500" fill="#C6F432">${esc(info.topics[0][0].toUpperCase() + info.topics[0].slice(1))}</text>
<text x="74" y="360" font-size="${size}" font-weight="800" letter-spacing="-6" fill="#EEF1E8">${esc(name)}</text>
<text x="80" y="440" font-size="32" fill="#8DA396">${esc(info.description)}</text>
<text x="80" y="570" font-size="28" font-weight="700" fill="#EEF1E8">github.com/${cfg.user}</text>
</svg>`;
  writeFileSync(`social/${name}.svg`, svg);
  try { execFileSync("rsvg-convert", [`social/${name}.svg`, "-o", `social/${name}.png`]); } catch { console.warn("rsvg-convert missing; SVG only"); }
}
console.log("done");
