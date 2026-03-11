#!/usr/bin/env bash
set -e

SRC="/mnt/d/Claude Stuff/barwon-agents/groups"
DST="/mnt/d/Claude Stuff/nanoclaw/groups"

# T1 + T2 agent folders (need separate group folders for scheduled tasks)
T1_T2=(
  barwon-analytics
  barwon-content
  barwon-growth
  barwon-finance
  barwon-research
  barwon-infra
  barwon-feedback
  barwon-data
  barwon-data-agg
  barwon-experiments
  barwon-pipeline
  barwon-weekly
)

echo "=== Copying T1/T2 agent folders ==="
for agent in "${T1_T2[@]}"; do
  cp -r "$SRC/$agent" "$DST/"
  echo "  ✓ $agent"
done

# Ops files → groups/global/ops/ (readable by all agent containers)
echo ""
echo "=== Copying ops files to global/ops/ ==="
mkdir -p "$DST/global/ops"
cp "/mnt/d/Claude Stuff/barwon-agents/workspace/ops/"*.md "$DST/global/ops/"
for f in "$DST/global/ops/"*.md; do
  echo "  ✓ $(basename "$f")"
done

# T3 agent CLAUDE.md files → groups/barwon/agents/ (inline routing)
echo ""
echo "=== Copying T3 agent CLAUDE.md files to barwon/agents/ ==="
mkdir -p "$DST/barwon/agents"
ALL_AGENTS=("$SRC"/barwon-*/.)
for agentdir in "${ALL_AGENTS[@]}"; do
  name=$(basename "$agentdir")
  if [[ -f "$SRC/$name/CLAUDE.md" ]]; then
    cp "$SRC/$name/CLAUDE.md" "$DST/barwon/agents/$name.md"
    echo "  ✓ $name.md"
  fi
done

echo ""
echo "=== Done. Verifying nanoclaw/groups/ ==="
ls "$DST" | sort
