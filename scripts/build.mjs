// Generates every SVG in assets/ (light + dark). Run: node scripts/build.mjs
import { writeFileSync, readFileSync, readdirSync, unlinkSync, mkdirSync } from "node:fs";

const themes = {
  light: {
    bg: "#F8F8FA",
    surface: "#FFFFFF",
    raised: "#EFEFF2",
    hairline: "rgba(0,0,0,0.08)",
    ink: "#111113",
    muted: "#686870",
    silver: "#2C2C30",
    silverLight: "#8E8E93",
    pop: "#111113",
    onPop: "#FFFFFF",
    discBg: "#111113",
    discArrow: "#F2F2F5",
  },
  dark: {
    bg: "#0A0A0C",
    surface: "#141416",
    raised: "#1E1E22",
    hairline: "rgba(255,255,255,0.08)",
    ink: "#F2F2F5",
    muted: "#8A8A93",
    silver: "#D1D1D6",
    silverLight: "#A1A1A6",
    pop: "#F2F2F5",
    onPop: "#0A0A0C",
    discBg: "#26262B",
    discArrow: "#F2F2F5",
  },
};
const SANS = "'Helvetica Neue','Segoe UI',Helvetica,Arial,'Liberation Sans',sans-serif";


// Batik kawung motif (four overlapping ovals + cecek dots), tiled and faded out with a mask.
// dir: where the pattern is strongest ("right", "topright"); it dissolves away from there.
let batikN = 0;
const batik = (w, h, { stroke, opacity = 0.06, dir = "right", scale = 1, fade = 0.75 }) => {
  const id = `b${batikN++}`;
  const g = { right: [1, 0.5, 0, 0.5], topright: [1, 0, 0, 1] }[dir] || [1, 0.5, 0, 0.5];
  return `<defs>
<pattern id="${id}p" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="scale(${scale})">
<g fill="none" stroke="${stroke}" stroke-width="1.4" stroke-linecap="round">
<ellipse cx="32" cy="15" rx="8.5" ry="15"/><ellipse cx="32" cy="49" rx="8.5" ry="15"/>
<ellipse cx="15" cy="32" rx="15" ry="8.5"/><ellipse cx="49" cy="32" rx="15" ry="8.5"/>
<circle cx="32" cy="32" r="3.2"/>
</g>
<g fill="${stroke}"><circle cx="0" cy="0" r="2"/><circle cx="64" cy="0" r="2"/><circle cx="0" cy="64" r="2"/><circle cx="64" cy="64" r="2"/>
<circle cx="32" cy="3" r="1.3"/><circle cx="32" cy="61" r="1.3"/><circle cx="3" cy="32" r="1.3"/><circle cx="61" cy="32" r="1.3"/></g>
</pattern>
<linearGradient id="${id}g" x1="${g[0]}" y1="${g[1]}" x2="${g[2]}" y2="${g[3]}"><stop offset="0" stop-color="#fff"/><stop offset="${fade}" stop-color="#000"/></linearGradient>
<mask id="${id}m"><rect width="${w}" height="${h}" fill="url(#${id}g)"/></mask>
</defs>
<rect width="${w}" height="${h}" fill="url(#${id}p)" opacity="${opacity}" mask="url(#${id}m)"/>`;
};

const hero = (t) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 360" width="1200" height="360" role="img" aria-label="Zakki Thoriq, software developer">
<style>
text{font-family:${SANS}}
.s1{animation:fl 8s ease-in-out infinite}.s2{animation:fl 10s ease-in-out -4s infinite}
@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@media (prefers-reduced-motion:reduce){.s1,.s2{animation:none}}
</style>
<rect width="1200" height="360" rx="24" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1.5"/>
<clipPath id="hc"><rect width="1200" height="360" rx="24"/></clipPath>
<g clip-path="url(#hc)">
  ${batik(1200, 360, { stroke: t.ink, opacity: t === themes.light ? 0.05 : 0.065, dir: "right", scale: 1.1, fade: 0.75 })}
  <!-- Architectural geometric craft on the right: matte silver & graphite plates -->
  <g transform="translate(820 40)">
    <!-- Radial drafting compass ring -->
    <circle cx="160" cy="140" r="130" fill="none" stroke="${t.hairline}" stroke-width="1.5" stroke-dasharray="4 6"/>
    <!-- Floating geometric plates with hairline edges -->
    <g class="s1">
      <rect x="90" y="40" width="180" height="180" rx="36" fill="${t.raised}" stroke="${t.hairline}" stroke-width="1.5"/>
      <circle cx="180" cy="130" r="44" fill="none" stroke="${t.silver}" stroke-width="2"/>
      <circle cx="180" cy="130" r="8" fill="${t.silver}"/>
    </g>
    <g class="s2">
      <rect x="20" y="150" width="140" height="80" rx="20" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1.5"/>
      <line x1="42" y1="190" x2="118" y2="190" stroke="${t.silverLight}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="120" cy="190" r="4" fill="${t.silver}"/>
    </g>
  </g>
</g>
<text x="64" y="80" font-size="22" font-weight="500" fill="${t.muted}">Hi, I'm</text>
<text x="62" y="172" font-size="96" font-weight="700" letter-spacing="-3.5" fill="${t.ink}">Zakki</text>
<text x="62" y="262" font-size="96" font-weight="700" letter-spacing="-3.5" fill="${t.ink}">Thoriq<tspan fill="${t.silver}">.</tspan></text>
<text x="64" y="318" font-size="22" font-weight="400" fill="${t.muted}">I build software, mostly small, mostly useful.</text>
</svg>`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

const tile = (t, { n, name, line, tag, hot }) => {
  const bg = t.surface;
  const ink = t.ink;
  const mut = t.muted;
  const size = name.length <= 8 ? 50 : name.length <= 11 ? 42 : name.length <= 14 ? 34 : 28;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 250" width="580" height="250" role="img" aria-label="${esc(name)}: ${esc(line)}">
<style>text{font-family:${SANS}}</style>
<rect width="580" height="250" rx="20" fill="${bg}" stroke="${t.hairline}" stroke-width="1.5"/>
<clipPath id="tc${n}"><rect width="580" height="250" rx="20"/></clipPath>
<g clip-path="url(#tc${n})">
  ${batik(580, 250, { stroke: ink, opacity: t === themes.light ? 0.045 : 0.055, dir: "topright", scale: 0.9, fade: 0.7 })}
</g>
<!-- Subtle silver marker for the most recently pushed project -->
<text x="36" y="96" font-size="${size}" font-weight="700" letter-spacing="-1.5" fill="${ink}">${esc(name)}</text>
<text x="36" y="140" font-size="20" font-weight="400" fill="${mut}">${esc(line)}</text>
<text x="36" y="214" font-size="16" font-weight="500" fill="${t.silverLight}">${esc(tag)}</text>
<!-- Minimal circular action disc -->
<circle cx="522" cy="198" r="24" fill="${t.discBg}" stroke="${t.hairline}" stroke-width="1.5"/>
<path d="M516 204 L528 192 M518 192 H528 V202" stroke="${t.discArrow}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
};

// ---- data ----
const cfg = JSON.parse(readFileSync("config.json", "utf8"));
mkdirSync("data", { recursive: true });
const headers = { "User-Agent": "profile-build", Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
async function cached(url, file, fallback) {
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status} for ${url}`);
    const data = await res.json();
    writeFileSync(file, JSON.stringify(data, null, 1));
    return data;
  } catch (e) {
    console.warn("API failed, using cache:", e.message);
    try { return JSON.parse(readFileSync(file, "utf8")); } catch { return fallback; }
  }
}
const repos = await cached(`https://api.github.com/users/${cfg.user}/repos?per_page=100&sort=pushed`, "data/repos.json", []);
if (!repos.length) throw new Error("No repo data and no cache");
const events = await cached(`https://api.github.com/users/${cfg.user}/events/public?per_page=100`, "data/events.json", []);

// originals only: no forks, not empty, not hidden; newest push first
const eligible = repos
  .filter((r) => !r.fork && !r.archived && r.size > 0 && !cfg.hide.includes(r.name))
  .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));
const picked = eligible.slice(0, cfg.count);

const ago = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso)) / 864e5);
  return d < 1 ? "today" : d < 30 ? `${d}d ago` : d < 365 ? `${Math.floor(d / 30)}mo ago` : `${Math.floor(d / 365)}y ago`;
};
const projects = picked.map((r, i) => ({
  n: String(i + 1).padStart(2, "0"),
  name: r.name,
  line: clip(cfg.blurbs[r.name] || r.description || `A ${r.language || "code"} project.`, 38),
  tag: [r.language, `pushed ${ago(r.pushed_at)}`].filter(Boolean).join(" · "),
  hot: i === 0,
  url: r.html_url,
}));

// language share by bytes across originals (top repos by recency, capped to keep API use low)
const bytes = {};
for (const r of eligible.slice(0, 15)) {
  const l = await cached(r.languages_url, `data/lang-${r.name}.json`, {});
  for (const [k, v] of Object.entries(l)) if (!cfg.ignoreLangs.includes(k)) bytes[k] = (bytes[k] || 0) + v;
}
const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
const topLangs = Object.entries(bytes).filter(([, v]) => v / total >= 0.01).sort((a, b) => b[1] - a[1]).slice(0, 4);
const langs = topLangs.slice(0, 3).map(([l]) => l).join("  ·  ");

const langBar = (t) => {
  const shades = t === themes.light
    ? ["#111113", "#48484A", "#8E8E93", "#C7C7CC"]
    : ["#F2F2F5", "#D1D1D6", "#8A8A93", "#48484A"];
  let x = 0;
  const W = 1136;
  let segs = "", labels = "";
  topLangs.forEach(([name, v], i) => {
    const w = Math.max(14, Math.round((v / total) * W));
    segs += `<rect x="${32 + x}" y="32" width="${w}" height="24" fill="${shades[i]}"/>`;
    x += w + 3;
  });
  topLangs.forEach(([name, v], i) => {
    const lx = 32 + i * 280;
    labels += `<circle cx="${lx + 8}" cy="94" r="6" fill="${shades[i]}"/><text x="${lx + 22}" y="99" font-size="18" font-weight="600" fill="${t.ink}">${esc(name)} <tspan font-weight="400" fill="${t.muted}">${Math.round((v / total) * 100)}%</tspan></text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 130" width="1200" height="130" role="img" aria-label="Language distribution: ${esc(topLangs.map(([n, v]) => `${n} ${Math.round((v / total) * 100)}%`).join(", "))}">
<style>text{font-family:${SANS}}</style>
<rect width="1200" height="130" rx="20" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1.5"/>
<clipPath id="lc"><rect x="32" y="32" width="1136" height="24" rx="12"/></clipPath>
<g clip-path="url(#lc)">${segs}</g>
${labels}
</svg>`;
};

// activity: public events per day for the last 6 weeks, as bars
const DAYS = 42;
const perDay = new Map();
for (const e of events) if (e.type !== "WatchEvent") { const d = e.created_at.slice(0, 10); perDay.set(d, (perDay.get(d) || 0) + 1); }
const today = new Date(); today.setUTCHours(0, 0, 0, 0);
const cellsData = [];
for (let i = DAYS - 1; i >= 0; i--) { const d = new Date(today - i * 864e5); cellsData.push({ d, n: perDay.get(d.toISOString().slice(0, 10)) || 0 }); }
const activeDays = cellsData.filter((c) => c.n).length;
const maxN = Math.max(1, ...cellsData.map((c) => c.n));
const activity = (t) => {
  const gap = 8, bw = (1136 - gap * (DAYS - 1)) / DAYS, base = 142, maxH = 96;
  let bars = "";
  cellsData.forEach((c, i) => {
    const h = c.n === 0 ? 6 : 14 + (maxH - 14) * (c.n / maxN);
    const fill = c.n === 0 ? t.raised : t.silver;
    const op = c.n === 0 ? 0.7 : 0.5 + 0.5 * (c.n / maxN);
    bars += `<rect x="${(32 + i * (bw + gap)).toFixed(1)}" y="${(base - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(6, bw / 2).toFixed(1)}" fill="${fill}" opacity="${op.toFixed(2)}"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 190" width="1200" height="190" role="img" aria-label="Public activity over the last 6 weeks: ${activeDays} active days">
<style>text{font-family:${SANS}}</style>
<rect width="1200" height="190" rx="20" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1.5"/>
${bars}
<text x="32" y="172" font-size="15" font-weight="400" fill="${t.muted}">6 weeks ago</text><text x="1168" y="172" text-anchor="end" font-size="15" font-weight="400" fill="${t.muted}">today</text>
</svg>`;
};

// "now" card: the latest push
const latest = picked[0];
const nowCard = (t) => {
  const blurb = cfg.blurbs[latest.name] || latest.description || "";
  const titleSize = latest.name.length <= 8 ? 54 : latest.name.length <= 12 ? 46 : 36;
  const lang = latest.language ? ` · ${latest.language}` : "";
  const pushTime = ago(latest.pushed_at);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 170" width="1200" height="170" role="img" aria-label="In the workshop: ${esc(latest.name)}${blurb ? " — " + esc(blurb) : ""}">
<style>
text{font-family:${SANS}}
.s1{animation:fl 8s ease-in-out infinite}.s2{animation:fl 9s ease-in-out -4s infinite}
@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
@media (prefers-reduced-motion:reduce){.s1,.s2{animation:none}}
</style>
<rect width="1200" height="170" rx="22" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1.5"/>
<clipPath id="nc"><rect width="1200" height="170" rx="22"/></clipPath>
<g clip-path="url(#nc)">
  ${batik(1200, 170, { stroke: t.ink, opacity: t === themes.light ? 0.05 : 0.065, dir: "right", scale: 1, fade: 0.72 })}
  <!-- Minimalist drafting / toolmaker accents on right -->
  <g transform="translate(870 0)">
    <g class="s1"><circle cx="120" cy="85" r="66" fill="${t.raised}" stroke="${t.hairline}" stroke-width="1.5"/></g>
    <g class="s2"><rect x="30" y="55" width="70" height="70" rx="20" fill="${t.surface}" stroke="${t.hairline}" stroke-width="1.5"/><circle cx="65" cy="90" r="14" fill="none" stroke="${t.silver}" stroke-width="2"/><circle cx="65" cy="90" r="4" fill="${t.silver}"/></g>
  </g>
</g>
<!-- Left content -->
<text x="54" y="47" font-size="16" font-weight="600" fill="${t.muted}">In the workshop <tspan font-weight="400" fill="${t.muted}">${esc(lang)} · pushed ${esc(pushTime)}</tspan></text>
<text x="52" y="104" font-size="${titleSize}" font-weight="700" letter-spacing="-2" fill="${t.ink}">${esc(latest.name)}</text>
${blurb ? `<text x="54" y="142" font-size="19" font-weight="400" fill="${t.muted}">${esc(clip(blurb, 60))}</text>` : ""}
<!-- Action disc on right -->
<g transform="translate(1120 85)">
  <circle cx="0" cy="0" r="28" fill="${t.discBg}" stroke="${t.hairline}" stroke-width="1.5"/>
  <path d="M-7 7 L7 -7 M-3 -7 H7 V3" stroke="${t.discArrow}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>`;
};

// ---- write ----
for (const f of readdirSync("assets")) unlinkSync("assets/" + f);
const pic = (name, alt, w) =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg"><img src="assets/${name}-light.svg" alt="${esc(alt)}" width="${w}"></picture>`;

for (const [k, t] of Object.entries(themes)) {
  writeFileSync(`assets/hero-${k}.svg`, hero(t));
  writeFileSync(`assets/lang-${k}.svg`, langBar(t));
  writeFileSync(`assets/activity-${k}.svg`, activity(t));
  writeFileSync(`assets/now-${k}.svg`, nowCard(t));
  projects.forEach((p, i) => writeFileSync(`assets/tile-${i + 1}-${k}.svg`, tile(t, p)));
}

const cells = projects.map((p, i) => `<td><a href="${p.url}">${pic(`tile-${i + 1}`, `${p.name}: ${p.line}`, 430)}</a></td>`);
const rows = [];
for (let i = 0; i < cells.length; i += 2) rows.push(`<tr>\n${cells.slice(i, i + 2).join("\n")}\n</tr>`);
const out = readFileSync("README.tpl.md", "utf8")
  .replace("{{HERO}}", pic("hero", "Zakki Thoriq, software developer", 880))
  .replace("{{TILES}}", `<table>\n${rows.join("\n")}\n</table>`)
  .replace("{{NOW}}", `<a href="${latest.html_url}">${pic("now", `In the workshop: ${latest.name}`, 880)}</a>`)
  .replace("{{LANGS}}", pic("lang", `Languages: ${topLangs.map(([n]) => n).join(", ")}`, 880))
  .replace("{{ACTIVITY}}", pic("activity", `${activeDays} active days in the last 12 weeks`, 880))
  .replace("{{DAYS}}", String(activeDays));
writeFileSync("README.md", out);
console.log("projects:", projects.map((p) => p.name).join(", "), "| langs:", langs);
