/**
 * fix-paths.mjs
 * Updates workspace path references in all barwon CLAUDE.md files
 * to match NanoClaw's actual container mount points.
 *
 * Replacements:
 *   /workspace/ops/          → /workspace/global/ops/
 *   /workspace/briefings/    → /workspace/group/briefings/
 *   /workspace/client-outputs/ → /workspace/group/client-outputs/
 *   Telegram                 → Discord  (in barwon master only)
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const GROUPS = '/mnt/d/Claude Stuff/nanoclaw/groups';

const REPLACEMENTS = [
  ['/workspace/ops/',            '/workspace/global/ops/'],
  ['/workspace/briefings/',      '/workspace/group/briefings/'],
  ['/workspace/client-outputs/', '/workspace/group/client-outputs/'],
];

function fixFile(filePath) {
  const original = readFileSync(filePath, 'utf8');
  let updated = original;

  for (const [from, to] of REPLACEMENTS) {
    updated = updated.replaceAll(from, to);
  }

  if (updated !== original) {
    writeFileSync(filePath, updated, 'utf8');
    const changes = REPLACEMENTS
      .filter(([from]) => original.includes(from))
      .map(([from, to]) => `${from} → ${to}`);
    return changes;
  }
  return null;
}

// Fix barwon master CLAUDE.md
const masterPath = join(GROUPS, 'barwon', 'CLAUDE.md');
const masterChanges = fixFile(masterPath);
if (masterChanges) {
  console.log('✓ groups/barwon/CLAUDE.md');
  masterChanges.forEach(c => console.log(`    ${c}`));
} else {
  console.log('- groups/barwon/CLAUDE.md  (no changes needed)');
}

// Fix all T1/T2 agent CLAUDE.md files
const agentFolders = [
  'barwon-analytics', 'barwon-content', 'barwon-growth',
  'barwon-finance', 'barwon-research',
  'barwon-infra', 'barwon-feedback', 'barwon-data',
  'barwon-data-agg', 'barwon-experiments', 'barwon-pipeline', 'barwon-weekly',
];

let fixed = 0;
for (const folder of agentFolders) {
  const p = join(GROUPS, folder, 'CLAUDE.md');
  const changes = fixFile(p);
  if (changes) {
    console.log(`✓ groups/${folder}/CLAUDE.md`);
    changes.forEach(c => console.log(`    ${c}`));
    fixed++;
  } else {
    console.log(`- groups/${folder}/CLAUDE.md  (no changes needed)`);
  }
}

console.log(`\nDone. Updated ${fixed + (masterChanges ? 1 : 0)} files.`);
