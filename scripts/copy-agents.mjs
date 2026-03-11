import { readdirSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const SRC = '/mnt/d/Claude Stuff/barwon-agents/groups';
const AGENTS_DIR = '/mnt/d/Claude Stuff/nanoclaw/groups/barwon/agents';

mkdirSync(AGENTS_DIR, { recursive: true });

const entries = readdirSync(SRC, { withFileTypes: true });
let count = 0;

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const src = join(SRC, entry.name, 'CLAUDE.md');
  const dst = join(AGENTS_DIR, `${entry.name}.md`);
  try {
    copyFileSync(src, dst);
    console.log(`  ✓ ${entry.name}.md`);
    count++;
  } catch {
    // CLAUDE.md doesn't exist in this folder, skip
  }
}

console.log(`\nCopied ${count} agent files to barwon/agents/`);
