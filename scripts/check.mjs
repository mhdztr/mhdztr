// Phase 4 checks. Run: node scripts/check.mjs  (exit 1 on any failure)
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
let fail = 0;
const ok = (m) => console.log("  ok  ", m);
const bad = (m) => { console.log("  FAIL", m); fail++; };

const files = readdirSync("assets").filter((f) => f.endsWith(".svg"));
const names = [...new Set(files.map((f) => f.replace(/-(light|dark)\.svg$/, "")))];

console.log("pairs & well-formed");
for (const n of names) {
  for (const k of ["light", "dark"]) {
    const f = `assets/${n}-${k}.svg`;
    if (!existsSync(f)) { bad(`${f} missing`); continue; }
    try { execFileSync("xmllint", ["--noout", f]); } catch { bad(`${f} not valid XML`); }
  }
}
if (!fail) ok(`${names.length} assets x2 themes valid`);

console.log("README references");
const readme = readFileSync("README.md", "utf8");
for (const m of readme.matchAll(/(?:src|srcset)="(assets\/[^"]+)"/g)) if (!existsSync(m[1])) bad(`README points at missing ${m[1]}`);
if (/\{\{[A-Z]+\}\}/.test(readme)) bad("unreplaced template placeholder");
else ok("no dangling references or placeholders");

console.log("text fits its container (estimated at 0.56em/char bold, 0.5em regular)");
for (const f of files) {
  const svg = readFileSync(`assets/${f}`, "utf8");
  const w = Number(svg.match(/viewBox="0 0 (\d+)/)[1]);
  for (const m of svg.matchAll(/<text x="([\d.]+)"[^>]*?font-size="(\d+)"([^>]*)>([^<]*)/g)) {
    const [whole, x, size, rest, txt] = m;
    if (/text-anchor="(end|middle)"/.test(whole)) continue;
    const width = txt.length * Number(size) * (/font-weight="[78]00"/.test(rest) ? 0.58 : 0.5);
    const limit = w - 32;
    if (Number(x) + width > limit && !/aria/.test(txt)) bad(`${f}: "${txt.slice(0, 30)}" may overflow (${Math.round(Number(x) + width)} > ${limit})`);
  }
}
if (!fail) ok("no overflow suspects");

console.log("renders (rsvg-convert)");
for (const f of files) {
  try { const png = execFileSync("rsvg-convert", [`assets/${f}`]); if (png.length < 1500) bad(`${f} renders almost empty`); }
  catch { bad(`${f} failed to render`); }
}
if (!fail) ok("all render non-empty");

console.log("offline fallback");
try {
  const out = execFileSync("node", ["--no-warnings", "-e", `
    globalThis.fetch = async () => { throw new Error("offline"); };
    await import("./scripts/build.mjs");`, "--input-type=module"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  if (/projects:/.test(out)) ok("build succeeds from cache with no network");
  else bad("offline build printed no summary");
} catch (e) { bad("offline build failed: " + String(e.stderr || e).split("\n")[0]); }

console.log(fail ? `\n${fail} failure(s)` : "\nall checks passed");
process.exit(fail ? 1 : 0);
