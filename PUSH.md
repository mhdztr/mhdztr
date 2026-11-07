
## After the redesign

- The README is generated: edit `README.tpl.md` and `config.json`, then `node scripts/build.mjs`. The GitHub Action (`.github/workflows/update.yml`) does it every 12 hours.
- Before pushing: `node scripts/check.mjs` (needs `xmllint` and `rsvg-convert`).
- Repo descriptions and topics: `gh auth login`, then `scripts/repo-meta.sh`.
- Social previews: `node scripts/social.mjs`, then upload `social/<repo>.png` under each repo's Settings → Social preview (GitHub has no API for this).
