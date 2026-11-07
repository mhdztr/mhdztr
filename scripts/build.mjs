// Generates every SVG in assets/ (light + dark). Run: node scripts/build.mjs
import { writeFileSync, readFileSync, readdirSync, unlinkSync, mkdirSync } from "node:fs";

const themes = {
  light: { bg: "#EEF1E8", surface: "#E0E6D3", ink: "#0F2A20", muted: "#4C6256", accent: "#0F2A20", pop: "#C6F432", onPop: "#0F2A20" },
  dark:  { bg: "#0D1712", surface: "#16241C", ink: "#E8EFDC", muted: "#8DA396", accent: "#C6F432", pop: "#C6F432", onPop: "#0D1712" },
};
const SANS = "'Helvetica Neue','Segoe UI',Helvetica,Arial,'Liberation Sans',sans-serif";


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

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

const band = (t, words) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" width="1200" height="120" role="img" aria-label="${esc(words)}">
<style>text{font-family:${SANS}}</style>
<rect width="1200" height="120" rx="28" fill="${t.pop}"/>
<text x="600" y="78" text-anchor="middle" font-size="46" font-weight="800" letter-spacing="-1" fill="${t.onPop}">${esc(words)}</text>
</svg>`;

const tile = (t, { n, name, line, tag, hot }) => {
  const bg = hot ? t.pop : t.surface, ink = hot ? t.onPop : t.ink, mut = hot ? t.onPop : t.muted;
  const size = name.length <= 8 ? 58 : name.length <= 11 ? 48 : name.length <= 14 ? 38 : 30;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 260" width="580" height="260" role="img" aria-label="${esc(name)}: ${esc(line)}">
<style>text{font-family:${SANS}}</style>
<rect width="580" height="260" rx="24" fill="${bg}"/>
<text x="36" y="58" font-size="18" font-weight="700" fill="${mut}" opacity=".75">${n}</text>
<text x="34" y="132" font-size="${size}" font-weight="800" letter-spacing="-1.5" fill="${ink}">${esc(name)}</text>
<text x="36" y="170" font-size="21" fill="${mut}">${esc(line)}</text>
<rect x="36" y="198" width="${tag.length * 11 + 32}" height="34" rx="17" fill="none" stroke="${ink}" stroke-width="1.8" opacity=".8"/>
<text x="52" y="221" font-size="14" font-weight="700" letter-spacing="1.2" fill="${ink}">${esc(tag)}</text>
<circle cx="520" cy="56" r="26" fill="${ink}"/>
<path d="M512 64 L528 48 M514 48 H528 V62" stroke="${hot ? t.pop : t.bg}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
};

// ---- data ----
const cfg = JSON.parse(readFileSync("config.json", "utf8"));
mkdirSync("data", { recursive: true });
let repos;
try {
  const headers = { "User-Agent": "profile-build", Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com/users/${cfg.user}/repos?per_page=100&sort=pushed`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  repos = await res.json();
  writeFileSync("data/repos.json", JSON.stringify(repos, null, 1));
} catch (e) {
  console.warn("API failed, using cached data/repos.json:", e.message);
  repos = JSON.parse(readFileSync("data/repos.json", "utf8"));
}

// originals only: no forks, not empty, not hidden; newest push first
const eligible = repos
  .filter((r) => !r.fork && !r.archived && r.size > 0 && !cfg.hide.includes(r.name))
  .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));
const picked = eligible.slice(0, cfg.count);

const ago = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso)) / 864e5);
  return d < 1 ? "TODAY" : d < 30 ? `${d}D AGO` : d < 365 ? `${Math.floor(d / 30)}MO AGO` : `${Math.floor(d / 365)}Y AGO`;
};
const projects = picked.map((r, i) => ({
  n: String(i + 1).padStart(2, "0"),
  name: r.name,
  line: clip(cfg.blurbs[r.name] || r.description || `A ${r.language || "code"} project.`, 38),
  tag: [r.language, ago(r.pushed_at)].filter(Boolean).join(" · ").toUpperCase(),
  hot: i === 0,
  url: r.html_url,
}));

// top languages among originals, by repo count
const counts = {};
for (const r of eligible) if (r.language && !cfg.ignoreLangs.includes(r.language)) counts[r.language] = (counts[r.language] || 0) + 1;
const langs = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([l]) => l).join("  ·  ");

// ---- write ----
for (const f of readdirSync("assets")) unlinkSync("assets/" + f);
const pic = (name, alt, w) =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg"><img src="assets/${name}-light.svg" alt="${esc(alt)}" width="${w}"></picture>`;

for (const [k, t] of Object.entries(themes)) {
  writeFileSync(`assets/hero-${k}.svg`, hero(t));
  writeFileSync(`assets/band-${k}.svg`, band(t, langs));
  projects.forEach((p, i) => writeFileSync(`assets/tile-${i + 1}-${k}.svg`, tile(t, p)));
}

const cells = projects.map((p, i) => `<td><a href="${p.url}">${pic(`tile-${i + 1}`, `${p.name}: ${p.line}`, 430)}</a></td>`);
const rows = [];
for (let i = 0; i < cells.length; i += 2) rows.push(`<tr>\n${cells.slice(i, i + 2).join("\n")}\n</tr>`);
const out = readFileSync("README.tpl.md", "utf8")
  .replace("{{HERO}}", pic("hero", "Zakki Thoriq, software developer", 880))
  .replace("{{TILES}}", `<table>\n${rows.join("\n")}\n</table>`)
  .replace("{{BAND}}", pic("band", langs.replace(/\s+/g, " "), 880));
writeFileSync("README.md", out);
console.log("projects:", projects.map((p) => p.name).join(", "), "| langs:", langs);
