import { writeFileSync, readFileSync, readdirSync, unlinkSync, mkdirSync } from "node:fs";

const SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans',Helvetica,Arial,sans-serif";
const MONO = "'SF Mono',SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

const themes = {
  light: {
    bg: "#FAFAFA",
    panel: "#FFFFFF",
    border: "#E1E4E8",
    ink: "#111827",
    muted: "#6B7280",
    dim: "#9CA3AF",
    accent: "#E65100",
    bar1: "#111827",
    bar2: "#E65100",
    bar3: "#6B7280",
    tickEmpty: "#F3F4F6",
    tickActive: "#111827",
    batikStroke: "#111827",
    batikOp: 0.08
  },
  dark: {
    bg: "#0D1117",
    panel: "#161B22",
    border: "#30363D",
    ink: "#F0F6FC",
    muted: "#8B949E",
    dim: "#484F58",
    accent: "#F59E0B",
    bar1: "#F0F6FC",
    bar2: "#F59E0B",
    bar3: "#8B949E",
    tickEmpty: "#21262D",
    tickActive: "#F59E0B",
    batikStroke: "#F0F6FC",
    batikOp: 0.07
  }
};

let batikCount = 0;
const batikCAD = (w, h, t) => {
  const id = `bc_${batikCount++}`;
  return `<defs>
<pattern id="${id}_p" width="80" height="80" patternUnits="userSpaceOnUse">
  <circle cx="40" cy="40" r="28" fill="none" stroke="${t.batikStroke}" stroke-width="0.8" opacity="${t.batikOp}"/>
  <circle cx="0" cy="0" r="28" fill="none" stroke="${t.batikStroke}" stroke-width="0.8" opacity="${t.batikOp}"/>
  <circle cx="80" cy="0" r="28" fill="none" stroke="${t.batikStroke}" stroke-width="0.8" opacity="${t.batikOp}"/>
  <circle cx="0" cy="80" r="28" fill="none" stroke="${t.batikStroke}" stroke-width="0.8" opacity="${t.batikOp}"/>
  <circle cx="80" cy="80" r="28" fill="none" stroke="${t.batikStroke}" stroke-width="0.8" opacity="${t.batikOp}"/>
  <circle cx="40" cy="40" r="3" fill="none" stroke="${t.batikStroke}" stroke-width="0.8" opacity="${t.batikOp * 1.5}"/>
  <line x1="36" y1="40" x2="44" y2="40" stroke="${t.batikStroke}" stroke-width="0.7" opacity="${t.batikOp * 1.5}"/>
  <line x1="40" y1="36" x2="40" y2="44" stroke="${t.batikStroke}" stroke-width="0.7" opacity="${t.batikOp * 1.5}"/>
</pattern>
<linearGradient id="${id}_m" x1="1" y1="0" x2="0" y2="0">
  <stop offset="0" stop-color="#fff" stop-opacity="1"/>
  <stop offset="0.65" stop-color="#fff" stop-opacity="0"/>
</linearGradient>
<mask id="${id}_mask"><rect width="${w}" height="${h}" fill="url(#${id}_m)"/></mask>
</defs>
<rect width="${w}" height="${h}" fill="url(#${id}_p)" mask="url(#${id}_mask)"/>`;
};

// Hero: High-precision technical masthead
const hero = (t) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 320" width="1200" height="320" role="img" aria-label="Zakki Thoriq — Developer profile">
<style>
text{font-family:${SANS}}
.mono{font-family:${MONO}}
</style>
<rect width="1200" height="320" rx="10" fill="${t.bg}" stroke="${t.border}" stroke-width="1"/>
${batikCAD(1200, 320, t)}

<!-- Header bar / Terminal coordinates -->
<line x1="0" y1="48" x2="1200" y2="48" stroke="${t.border}" stroke-width="1"/>
<text class="mono" x="48" y="32" font-size="13" font-weight="600" fill="${t.muted}" letter-spacing="1.5">SYS://MHDZTR/PROFILE</text>
<text class="mono" x="1152" y="32" text-anchor="end" font-size="13" fill="${t.dim}">JAKARTA [6°12'S 106°49'E] · ARCH LINUX</text>

<!-- Main Name & Identity -->
<text x="48" y="148" font-size="82" font-weight="800" letter-spacing="-3" fill="${t.ink}">Zakki Thoriq</text>

<!-- Subtitle / Mission line -->
<text class="mono" x="48" y="200" font-size="20" fill="${t.ink}">Developer · Systems, CLI utilities, and web applications.</text>
<text x="48" y="242" font-size="18" fill="${t.muted}">Building small, reliable tools in Rust, Java, and JavaScript. Zero fluff.</text>

<!-- Bottom spec tags -->
<line x1="48" y1="272" x2="1152" y2="272" stroke="${t.border}" stroke-width="1"/>
<text class="mono" x="48" y="298" font-size="13" fill="${t.muted}">CORE // <tspan fill="${t.ink}" font-weight="700">RUST</tspan> · <tspan fill="${t.ink}" font-weight="700">JAVA</tspan> · <tspan fill="${t.ink}" font-weight="700">JAVASCRIPT</tspan></text>
<text class="mono" x="1152" y="298" text-anchor="end" font-size="13" fill="${t.accent}">STATUS: ACTIVE_DEVELOPMENT</text>
</svg>`;

// Workshop / Active Focus: Technical schematic card
const nowCard = (t, latest, blurb, pushTime) => {
  const lang = latest.language ? latest.language.toUpperCase() : "CODE";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 150" width="1200" height="150" role="img" aria-label="Current Focus: ${esc(latest.name)}">
<style>text{font-family:${SANS}} .mono{font-family:${MONO}}</style>
<rect width="1200" height="150" rx="10" fill="${t.panel}" stroke="${t.border}" stroke-width="1"/>
${batikCAD(1200, 150, t)}



<g transform="translate(48 0)">
  <!-- Header row -->
  <text class="mono" x="0" y="38" font-size="12" font-weight="700" letter-spacing="1.5" fill="${t.accent}">CURRENT FOCUS // REPOSITORY</text>
  <text class="mono" x="1104" y="38" text-anchor="end" font-size="13" fill="${t.muted}">PUSHED ${esc(pushTime.toUpperCase())} · ${esc(lang)}</text>
  
  <!-- Project Title & Link -->
  <text x="0" y="88" font-size="44" font-weight="800" letter-spacing="-1.5" fill="${t.ink}">${esc(latest.name)} <tspan font-size="18" font-weight="500" fill="${t.muted}">— active project</tspan></text>
  
  <!-- Description -->
  <text x="0" y="122" font-size="17" fill="${t.muted}">${esc(clip(blurb, 75))}</text>
</g>

<!-- Right arrow glyph in clean technical box -->
<g transform="translate(1100 70)">
  <rect width="52" height="52" rx="8" fill="${t.bg}" stroke="${t.border}" stroke-width="1"/>
  <path d="M20 32 L32 20 M23 20 H32 V29" stroke="${t.ink}" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>`;
};

// Project Tile: Precision spec tile
const tile = (t, { n, name, line, tag, hot }) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 190" width="580" height="190" role="img" aria-label="${esc(name)}: ${esc(line)}">
<style>text{font-family:${SANS}} .mono{font-family:${MONO}}</style>
<rect width="580" height="190" rx="10" fill="${t.panel}" stroke="${hot ? t.accent : t.border}" stroke-width="${hot ? '1.5' : '1'}"/>

<!-- Header line -->
<g transform="translate(28 34)">
  <text class="mono" x="0" y="0" font-size="12" font-weight="700" fill="${hot ? t.accent : t.muted}">${n} // REPO</text>
  <text class="mono" x="524" y="0" text-anchor="end" font-size="12" fill="${t.dim}">${esc(tag)}</text>
</g>

<!-- Title -->
<text x="28" y="86" font-size="38" font-weight="800" letter-spacing="-1" fill="${t.ink}">${esc(name)}</text>

<!-- Description -->
<text x="28" y="124" font-size="16" fill="${t.muted}">${esc(clip(line, 36))}</text>

<!-- Bottom tech footer -->
<line x1="28" y1="150" x2="552" y2="150" stroke="${t.border}" stroke-width="0.8"/>
<text class="mono" x="28" y="172" font-size="11" fill="${t.dim}">github.com/mhdztr/${esc(name)}</text>
<text class="mono" x="552" y="172" text-anchor="end" font-size="12" font-weight="700" fill="${hot ? t.accent : t.ink}">VIEW ↗</text>
</svg>`;

// ---- DATA & FETCH ----
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

// Originals only
const eligible = repos
  .filter((r) => !r.fork && !r.archived && r.size > 0 && !cfg.hide.includes(r.name))
  .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at));
const picked = eligible.slice(0, cfg.count);

const ago = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso)) / 864e5);
  return d < 1 ? "today" : d < 30 ? `${d}d ago` : d < 365 ? `${Math.floor(d / 30)}mo ago` : `${Math.floor(d / 365)}y ago`;
};

const latest = picked[0];
const latestBlurb = cfg.blurbs[latest.name] || latest.description || `A ${latest.language || "code"} project.`;
const latestPush = ago(latest.pushed_at);

const projects = picked.map((r, i) => ({
  n: String(i + 1).padStart(2, "0"),
  name: r.name,
  line: cfg.blurbs[r.name] || r.description || `A ${r.language || "code"} project.`,
  tag: [r.language, ago(r.pushed_at)].filter(Boolean).join(" · ").toUpperCase(),
  hot: i === 0,
  url: r.html_url,
}));

// Language distribution by bytes
const bytes = {};
for (const r of eligible.slice(0, 15)) {
  const l = await cached(r.languages_url, `data/lang-${r.name}.json`, {});
  for (const [k, v] of Object.entries(l)) if (!cfg.ignoreLangs.includes(k)) bytes[k] = (bytes[k] || 0) + v;
}
const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
const topLangs = Object.entries(bytes)
  .filter(([, v]) => v / total >= 0.01)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 4);

const langBar = (t) => {
  const W = 1104;
  const barColors = [t.bar1, t.bar2, t.bar3, t.dim];
  let x = 0;
  let segs = "";
  let labels = "";
  
  topLangs.forEach(([name, v], i) => {
    const pct = Math.round((v / total) * 100);
    const w = Math.max(8, Math.round((v / total) * W));
    segs += `<rect x="${x}" y="0" width="${w}" height="14" rx="2" fill="${barColors[i % barColors.length]}"/>`;
    x += w + 3;
    
    const lx = i * 220;
    labels += `<rect x="${lx}" y="-8" width="10" height="10" rx="2" fill="${barColors[i % barColors.length]}"/>
<text class="mono" x="${lx + 18}" y="0" font-size="13" font-weight="600" fill="${t.ink}">${esc(name)} <tspan fill="${t.muted}">${pct}%</tspan></text>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" width="1200" height="120" role="img" aria-label="Language distribution">
<style>text{font-family:${SANS}} .mono{font-family:${MONO}}</style>
<rect width="1200" height="120" rx="8" fill="${t.panel}" stroke="${t.border}" stroke-width="1"/>
<text class="mono" x="48" y="32" font-size="12" font-weight="700" letter-spacing="1.5" fill="${t.muted}">TELEMETRY // LANGUAGE DISTRIBUTION</text>
<text class="mono" x="1152" y="32" text-anchor="end" font-size="12" fill="${t.dim}">BY SOURCE BYTES</text>
<g transform="translate(48 46)">${segs}</g>
<g transform="translate(48 94)">${labels}</g>
</svg>`;
};

// Activity Trace
const DAYS = 42;
const perDay = new Map();
for (const e of events) if (e.type !== "WatchEvent") { const d = e.created_at.slice(0, 10); perDay.set(d, (perDay.get(d) || 0) + 1); }
const today = new Date(); today.setUTCHours(0, 0, 0, 0);
const cellsData = [];
for (let i = DAYS - 1; i >= 0; i--) { const d = new Date(today - i * 864e5); cellsData.push({ d, n: perDay.get(d.toISOString().slice(0, 10)) || 0 }); }
const activeDays = cellsData.filter((c) => c.n).length;
const maxN = Math.max(1, ...cellsData.map((c) => c.n));

const activity = (t) => {
  const gap = 8, bw = (1104 - gap * (DAYS - 1)) / DAYS, base = 120, maxH = 65;
  let bars = "";
  cellsData.forEach((c, i) => {
    const h = c.n === 0 ? 4 : 12 + (maxH - 12) * (c.n / maxN);
    const fill = c.n === 0 ? t.tickEmpty : t.tickActive;
    bars += `<rect x="${(48 + i * (bw + gap)).toFixed(1)}" y="${(base - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="1" fill="${fill}"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 170" width="1200" height="170" role="img" aria-label="Activity Trace: ${activeDays} active days">
<style>text{font-family:${SANS}} .mono{font-family:${MONO}}</style>
<rect width="1200" height="170" rx="8" fill="${t.panel}" stroke="${t.border}" stroke-width="1"/>
<text class="mono" x="48" y="32" font-size="12" font-weight="700" letter-spacing="1.5" fill="${t.muted}">TRACE // PUBLIC EVENT LOG (LAST 42 DAYS)</text>
<text class="mono" x="1152" y="32" text-anchor="end" font-size="12" fill="${t.accent}">${activeDays} ACTIVE DAYS RECORDED</text>
${bars}
<line x1="48" y1="126" x2="1152" y2="126" stroke="${t.border}" stroke-width="1"/>
<text class="mono" x="48" y="148" font-size="11" fill="${t.dim}">T-42 DAYS</text>
<text class="mono" x="1152" y="148" text-anchor="end" font-size="11" fill="${t.dim}">TODAY</text>
</svg>`;
};

// ---- WRITE ASSETS ----
for (const f of readdirSync("assets")) unlinkSync("assets/" + f);

const pic = (name, alt, w) =>
  `<picture><source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg"><img src="assets/${name}-light.svg" alt="${esc(alt)}" width="${w}"></picture>`;

for (const [k, t] of Object.entries(themes)) {
  writeFileSync(`assets/hero-${k}.svg`, hero(t));
  writeFileSync(`assets/now-${k}.svg`, nowCard(t, latest, latestBlurb, latestPush));
  writeFileSync(`assets/lang-${k}.svg`, langBar(t));
  writeFileSync(`assets/activity-${k}.svg`, activity(t));
  projects.forEach((p, i) => writeFileSync(`assets/tile-${i + 1}-${k}.svg`, tile(t, p)));
}

const cells = projects.map((p, i) => `<td><a href="${p.url}">${pic(`tile-${i + 1}`, `${p.name}: ${p.line}`, 430)}</a></td>`);
const rows = [];
for (let i = 0; i < cells.length; i += 2) rows.push(`<tr>\n${cells.slice(i, i + 2).join("\n")}\n</tr>`);

const out = readFileSync("README.tpl.md", "utf8")
  .replace("{{HERO}}", pic("hero", "Zakki Thoriq — Developer profile", 880))
  .replace("{{TILES}}", `<table>\n${rows.join("\n")}\n</table>`)
  .replace("{{NOW}}", `<a href="${latest.html_url}">${pic("now", `Focus: ${latest.name}`, 880)}</a>`)
  .replace("{{LANGS}}", pic("lang", `Languages: ${topLangs.map(([n]) => n).join(", ")}`, 880))
  .replace("{{ACTIVITY}}", pic("activity", `${activeDays} active days recorded in the last 42 days`, 880))
  .replace("{{DAYS}}", String(activeDays));

writeFileSync("README.md", out);
console.log("projects:", projects.map((p) => p.name).join(", "), "| langs:", topLangs.map(([l]) => l).join("  ·  "));
