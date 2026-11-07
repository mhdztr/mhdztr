#!/usr/bin/env bash
# Safe push: brings in the bot's commits first, then pushes. Use this instead of `git push`.
set -euo pipefail
git pull --rebase --autostash -X ours origin "$(git branch --show-current)"
git push
