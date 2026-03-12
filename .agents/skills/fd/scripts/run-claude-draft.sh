#!/usr/bin/env bash
set -euo pipefail

SPEC="${1:-}"
if [ -z "$SPEC" ]; then
  echo "Usage: run-claude-draft.sh '<spec>'"
  exit 1
fi

PROMPT=$(cat <<EOF
You are generating the FIRST DRAFT of a frontend UI.
Focus on:
- visual hierarchy
- spacing
- polished layout
- modern UI feel

Do NOT spend time on exhaustive testing or edge-case hardening.
Do NOT refactor unrelated files.
Prefer editing only the minimum relevant files.

Task:
$SPEC
EOF
)

CLAUDE_OUTPUT_FORMAT="${CLAUDE_OUTPUT_FORMAT:-text}"
CLAUDE_INCLUDE_PARTIAL_MESSAGES="${CLAUDE_INCLUDE_PARTIAL_MESSAGES:-0}"

CLAUDE_ARGS=(
  -p
  --dangerously-skip-permissions
  --output-format "$CLAUDE_OUTPUT_FORMAT"
)

if [ -n "${CLAUDE_MAX_TURNS:-}" ]; then
  CLAUDE_ARGS+=(--max-turns "$CLAUDE_MAX_TURNS")
fi

if [ "$CLAUDE_OUTPUT_FORMAT" = "stream-json" ] && [ "$CLAUDE_INCLUDE_PARTIAL_MESSAGES" = "1" ]; then
  CLAUDE_ARGS+=(--include-partial-messages)
fi

claude "${CLAUDE_ARGS[@]}" "$PROMPT"
