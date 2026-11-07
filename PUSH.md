
## After the redesign

- The README is generated: edit `README.tpl.md` and `config.json`, then `node scripts/build.mjs`. The GitHub Action (`.github/workflows/update.yml`) does it every 12 hours.
- Before pushing: `node scripts/check.mjs` (needs `xmllint` and `rsvg-convert`).
- Repo descriptions and topics: `gh auth login`, then `scripts/repo-meta.sh`.
- Social previews: `node scripts/social.mjs`, then upload `social/<repo>.png` under each repo's Settings → Social preview (GitHub has no API for this).

## Pushing without "fetch first" errors

The Action commits to `main` on its own, so a plain `git push` can be rejected. Always use:

    git sync

(an alias for `scripts/sync.sh`: pull with rebase, then push). If the alias is missing on a new clone: `git config alias.sync '!bash scripts/sync.sh'`.
