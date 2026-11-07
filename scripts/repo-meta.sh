#!/usr/bin/env bash
# Applies descriptions + topics from config.json to your repos. Needs GitHub CLI logged in: gh auth login
set -euo pipefail
USER_NAME=$(node -p "require('./config.json').user")
node -e '
const m=require("./config.json").repoMeta;
for (const [n,i] of Object.entries(m)) console.log([n,i.description,i.topics.join(",")].join("\t"));
' | while IFS=$'\t' read -r name desc topics; do
  echo "→ $name"
  gh repo edit "$USER_NAME/$name" --description "$desc" --add-topic "$topics"
done
