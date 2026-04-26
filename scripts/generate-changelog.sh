#!/usr/bin/env bash
# Generate changelog entries from merged PRs since the last tag.
# Usage: ./scripts/generate-changelog.sh [since-tag]
# If no tag is given, uses the latest tag.

set -euo pipefail

SINCE_TAG="${1:-$(git describe --tags --abbrev=0 2>/dev/null || echo "")}"
DATE=$(date +%Y-%m-%d)

if [ -z "$SINCE_TAG" ]; then
  echo "No previous tag found. Listing all merged PRs on main." >&2
  RANGE="main"
else
  echo "Generating changelog since $SINCE_TAG" >&2
  RANGE="${SINCE_TAG}..HEAD"
fi

# Collect merge commit messages (PR titles from squash merges)
FEATS=""
FIXES=""
IMPROVEMENTS=""
OTHER=""

while IFS= read -r line; do
  # Skip empty lines
  [ -z "$line" ] && continue

  # Categorize by conventional commit prefix
  if echo "$line" | grep -qiE '^feat(\(.+\))?:'; then
    entry=$(echo "$line" | sed -E 's/^feat(\([^)]+\))?: //')
    FEATS="${FEATS}\n- ${entry}"
  elif echo "$line" | grep -qiE '^fix(\(.+\))?:'; then
    entry=$(echo "$line" | sed -E 's/^fix(\([^)]+\))?: //')
    FIXES="${FIXES}\n- ${entry}"
  elif echo "$line" | grep -qiE '^(improvement|improve|chore|docs|refactor|perf|style|ci|build)(\(.+\))?:'; then
    entry=$(echo "$line" | sed -E 's/^(improvement|improve|chore|docs|refactor|perf|style|ci|build)(\([^)]+\))?: //')
    IMPROVEMENTS="${IMPROVEMENTS}\n- ${entry}"
  else
    OTHER="${OTHER}\n- ${line}"
  fi
done < <(git log --oneline --first-parent "$RANGE" 2>/dev/null | sed 's/^[a-f0-9]* //')

# Output markdown
echo ""
echo "## [Unreleased] - ${DATE}"
echo ""

if [ -n "$FEATS" ]; then
  echo "### Added"
  echo -e "$FEATS"
  echo ""
fi

if [ -n "$FIXES" ]; then
  echo "### Fixed"
  echo -e "$FIXES"
  echo ""
fi

if [ -n "$IMPROVEMENTS" ]; then
  echo "### Changed"
  echo -e "$IMPROVEMENTS"
  echo ""
fi

if [ -n "$OTHER" ]; then
  echo "### Other"
  echo -e "$OTHER"
  echo ""
fi
