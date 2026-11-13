#!/usr/bin/env bash
# File one GitHub issue per finding in .github/security-issues/.
#
# Requires: gh (authenticated), and **Issues enabled** for the repository
# (Settings -> General -> Features -> Issues). The repository had Issues
# disabled at review time, so this script is the one-command follow-up.
#
#   ./scripts/create-security-issues.sh
#
set -euo pipefail

REPO="$(git remote get-url origin | sed -E 's#.*github.com[:/]([^/]+/[^/.]+)(\.git)?$#\1#')"
DIR="$(cd "$(dirname "$0")/../.github/security-issues" && pwd)"

# GitHub's HTTP/2 endpoint misbehaves in some sandboxes; force HTTP/1.1.
export GODEBUG=http2client=0

if ! gh issue list --repo "$REPO" --state all --limit 1 >/dev/null 2>&1; then
  echo "Issues are disabled or inaccessible for $REPO." >&2
  echo "Enable them under https://github.com/$REPO/settings -> Features -> Issues, then re-run." >&2
  exit 1
fi

gh label create security --repo "$REPO" --color 000000 \
  --description "Security finding or hardening task" --force >/dev/null 2>&1 || true

existing="$(gh api "repos/$REPO/issues?state=all&per_page=100" --jq '.[].title' 2>/dev/null || true)"

created=0
skipped=0
while IFS=$'\t' read -r id title severity; do
  [[ -z "$id" || "$id" == \#* ]] && continue
  body="$DIR/$id.md"
  [[ -f "$body" ]] || { echo "missing $body" >&2; exit 1; }
  if grep -Fxq "$title" <<<"$existing"; then
    echo "skip  $id (already open): $title"
    skipped=$((skipped + 1))
    continue
  fi
  url="$(gh issue create --repo "$REPO" --title "$title" --body-file "$body" --label security)"
  echo "open  $id [$severity] $url"
  created=$((created + 1))
done < "$DIR/manifest.tsv"

echo "Done. Created: $created · already present: $skipped"
