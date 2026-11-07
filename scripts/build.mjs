// Generates every SVG in assets/ (light + dark). Run: node scripts/build.mjs
import { writeFileSync, readFileSync, readdirSync, unlinkSync, mkdirSync } from "node:fs";

const themes = {
  light: { bg: "#EEF1E8", surface: "#E0E6D3", ink: "#0F2A20", muted: "#4C6256", accent: "#0F2A20", pop: "#C6F432", onPop: "#0F2A20" },
  dark:  { bg: "#0D1712", surface: "#16241C", ink: "#E8EFDC", muted: "#8DA396", accent: "#C6F432", pop: "#C6F432", onPop: "#0D1712" },
};
const SANS = "'Helvetica Neue','Segoe UI',Helvetica,Arial,'Liberation Sans',sans-serif";


// Batik kawung motif (four overlapping ovals + cecek dots), tiled and faded out with a mask.
// dir: where the pattern is strongest ("right", "topright"); it dissolves away from there.
let batikN = 0;
const batik = (w, h, { stroke, opacity = 0.14, dir = "right", scale = 1, fade = 0.75 }) => {
  const id = `b${batikN++}`;
  const g = { right: [1, 0.5, 0, 0.5], topright: [1, 0, 0, 1] }[dir];
  return `<defs>
<pattern id="${id}p" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="scale(${scale})">
<g fill="none" stroke="${stroke}" stroke-width="1.6" stroke-linecap="round">
<ellipse cx="32" cy="15" rx="8.5" ry="15"/><ellipse cx="32" cy="49" rx="8.5" ry="15"/>
<ellipse cx="15" cy="32" rx="15" ry="8.5"/><ellipse cx="49" cy="32" rx="15" ry="8.5"/>
<circle cx="32" cy="32" r="3.4"/>
</g>
<g fill="${stroke}"><circle cx="0" cy="0" r="2.2"/><circle cx="64" cy="0" r="2.2"/><circle cx="0" cy="64" r="2.2"/><circle cx="64" cy="64" r="2.2"/>
<circle cx="32" cy="3" r="1.4"/><circle cx="32" cy="61" r="1.4"/><circle cx="3" cy="32" r="1.4"/><circle cx="61" cy="32" r="1.4"/></g>
</pattern>
<linearGradient id="${id}g" x1="${g[0]}" y1="${g[1]}" x2="${g[2]}" y2="${g[3]}"><stop offset="0" stop-color="#fff"/><stop offset="${fade}" stop-color="#000"/></linearGradient>
<mask id="${id}m"><rect width="${w}" height="${h}" fill="url(#${id}g)"/></mask>
</defs>
<rect width="${w}" height="${h}" fill="url(#${id}p)" opacity="${opacity}" mask="url(#${id}m)"/>`;
};

const hero = (t) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 380" width="1200" height="380" role="img" aria-label="Zakki Thoriq, software developer">
<style>
text{font-family:${SANS}}
.f1{animation:fl 7s ease-in-out infinite}.f2{animation:fl 9s ease-in-out -3s infinite}.f3{animation:fl 8s ease-in-out -5s infinite}
@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-14px)}}
@media (prefers-reduced-motion:reduce){.f1,.f2,.f3{animation:none}}
</style>
<rect width="1200" height="380" rx="28" fill="${t.bg}"/>
<clipPath id="hc"><rect width="1200" height="380" rx="28"/></clipPath>
<g clip-path="url(#hc)">${batik(1200, 380, { stroke: t.ink, opacity: t === themes.light ? 0.15 : 0.14, dir: "right", scale: 1.15, fade: 0.8 })}</g>
<g transform="translate(790 0)">
  <g class="f1"><circle cx="150" cy="130" r="92" fill="${t.pop}"/></g>
  <g class="f2"><rect x="215" y="150" width="170" height="170" rx="40" fill="${t.surface}"/><circle cx="300" cy="235" r="34" fill="none" stroke="${t.ink}" stroke-width="10"/></g>
  <g class="f3"><rect x="20" y="215" width="170" height="90" rx="45" fill="${t.ink}"/><circle cx="145" cy="260" r="24" fill="${t.pop}"/></g>
</g>
<text x="64" y="76" font-size="28" font-weight="500" fill="${t.muted}">Hi, I'm</text>
<text x="60" y="170" font-size="104" font-weight="800" letter-spacing="-4" fill="${t.ink}">Zakki</text>
<text x="60" y="266" font-size="104" font-weight="800" letter-spacing="-4" fill="${t.ink}">Thoriq<tspan fill="${t.pop}">.</tspan></text>
<text x="64" y="336" font-size="24" fill="${t.muted}">I build software, mostly small, mostly useful.</text>
</svg>`;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

const tile = (t, { n, name, line, tag, hot }) => {
  const bg = hot ? t.pop : t.surface, ink = hot ? t.onPop : t.ink, mut = hot ? t.onPop : t.muted;
  const size = name.length <= 8 ? 58 : name.length <= 11 ? 48 : name.length <= 14 ? 38 : 30;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 580 260" width="580" height="260" role="img" aria-label="${esc(name)}: ${esc(line)}">
<style>text{font-family:${SANS}}</style>
<rect width="580" height="260" rx="24" fill="${bg}"/>
<clipPath id="tc"><rect width="580" height="260" rx="24"/></clipPath>
<g clip-path="url(#tc)">${batik(580, 260, { stroke: ink, opacity: hot ? 0.22 : 0.16, dir: "topright", scale: 0.9, fade: 0.7 })}</g>
<text x="34" y="132" font-size="${size}" font-weight="800" letter-spacing="-1.5" fill="${ink}">${esc(name)}</text>
<text x="36" y="170" font-size="21" fill="${mut}">${esc(line)}</text>
<text x="36" y="226" font-size="18" font-weight="500" fill="${ink}">${esc(tag)}</text>
<circle cx="520" cy="206" r="26" fill="${ink}"/>
<path d="M512 214 L528 198 M514 198 H528 V212" stroke="${hot ? t.pop : t.bg}" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
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
  const shades = [t.pop, t.ink, t.muted, t.surface];
  let x = 0;
  const W = 1136;
  let segs = "", labels = "";
  topLangs.forEach(([name, v], i) => {
    const w = Math.max(14, Math.round((v / total) * W));
    segs += `<rect x="${32 + x}" y="34" width="${w}" height="30" fill="${shades[i]}"${i === 0 ? ' rx="15"' : ""}/>`;
    x += w + 4;
  });
  topLangs.forEach(([name, v], i) => {
    const lx = 32 + i * 280;
    labels += `<circle cx="${lx + 8}" cy="100" r="8" fill="${shades[i]}" stroke="${t.muted}" stroke-width="1"/><text x="${lx + 26}" y="106" font-size="19" font-weight="700" fill="${t.ink}">${esc(name)} <tspan font-weight="400" fill="${t.muted}">${Math.round((v / total) * 100)}%</tspan></text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 140" width="1200" height="140" role="img" aria-label="Language share: ${esc(topLangs.map(([n, v]) => `${n} ${Math.round((v / total) * 100)}%`).join(", "))}">
<style>text{font-family:${SANS}}</style>
<rect width="1200" height="140" rx="28" fill="${t.bg}" stroke="${t.surface}" stroke-width="2"/>
<clipPath id="c"><rect x="32" y="34" width="1136" height="30" rx="15"/></clipPath>
<g clip-path="url(#c)">${segs}</g>
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
  const gap = 8, bw = (1136 - gap * (DAYS - 1)) / DAYS, base = 150, maxH = 110;
  let bars = "";
  cellsData.forEach((c, i) => {
    const h = c.n === 0 ? 8 : 16 + (maxH - 16) * (c.n / maxN);
    bars += `<rect x="${(32 + i * (bw + gap)).toFixed(1)}" y="${(base - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(10, bw / 2).toFixed(1)}" fill="${c.n === 0 ? t.surface : t.pop}"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 210" width="1200" height="210" role="img" aria-label="Public activity over the last 6 weeks: ${activeDays} active days">
<style>text{font-family:${SANS}}</style>
<rect width="1200" height="210" rx="28" fill="${t.bg}" stroke="${t.surface}" stroke-width="2"/>
${bars}
<text x="32" y="188" font-size="16" fill="${t.muted}">6 weeks ago</text><text x="1168" y="188" text-anchor="end" font-size="16" fill="${t.muted}">today</text>
</svg>`;
};

// "now" card: the latest push
const latest = picked[0];
const nowCard = (t) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 150" width="1200" height="150" role="img" aria-label="Currently working on ${esc(latest.name)}">
<style>text{font-family:${SANS}}</style>
<rect width="1200" height="150" rx="28" fill="#0F2A20"/>
<clipPath id="nc"><rect width="1200" height="150" rx="28"/></clipPath>
<g clip-path="url(#nc)">${batik(1200, 150, { stroke: "#C6F432", opacity: 0.2, dir: "right", scale: 0.9, fade: 0.65 })}</g>
<text x="48" y="62" font-size="24" font-weight="500" fill="#C6F432">Currently working on</text>
<text x="46" y="114" font-size="52" font-weight="800" letter-spacing="-1.5" fill="#EEF1E8">${esc(latest.name)}</text>
<text x="1152" y="114" text-anchor="end" font-size="24" fill="#EEF1E8">last push ${esc(ago(latest.pushed_at))}</text>
</svg>`;

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
  .replace("{{NOW}}", `<a href="${latest.html_url}">${pic("now", `Working on ${latest.name}`, 880)}</a>`)
  .replace("{{LANGS}}", pic("lang", `Languages: ${topLangs.map(([n]) => n).join(", ")}`, 880))
  .replace("{{ACTIVITY}}", pic("activity", `${activeDays} active days in the last 12 weeks`, 880))
  .replace("{{DAYS}}", String(activeDays));
writeFileSync("README.md", out);
console.log("projects:", projects.map((p) => p.name).join(", "), "| langs:", langs);
