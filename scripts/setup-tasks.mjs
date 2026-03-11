/**
 * setup-tasks.mjs
 * Registers all 12 Barwon scheduled tasks (5 T1 + 7 T2) in NanoClaw's SQLite DB.
 * Run once: node scripts/setup-tasks.mjs
 */

import Database from '../node_modules/better-sqlite3/lib/index.js';
import cronParserPkg from '../node_modules/cron-parser/dist/index.js';
const { CronExpressionParser } = cronParserPkg;
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomUUID } from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'store', 'messages.db');
const TZ = 'Australia/Melbourne';

const DAILY_JID   = 'dc:1480893881284427806';  // #daily   — T1 briefings
const WEEKLY_JID  = 'dc:1480893905519251528';  // #weekly  — T2 reports
const FLAGS_JID   = 'dc:1480893928151716042';  // #flags   — critical alerts

const tasks = [
  // ── T1 Daily briefings (Mon–Fri) ────────────────────────────────────────
  {
    folder: 'barwon-analytics',
    cron:   '0 7 * * 1-5',
    jid:    DAILY_JID,
    prompt: 'Run your scheduled T1 daily briefing.',
    label:  'T1 analytics      7:00 AM Mon–Fri',
  },
  {
    folder: 'barwon-content',
    cron:   '30 7 * * 1-5',
    jid:    DAILY_JID,
    prompt: 'Run your scheduled T1 daily briefing.',
    label:  'T1 content        7:30 AM Mon–Fri',
  },
  {
    folder: 'barwon-growth',
    cron:   '0 8 * * 1-5',
    jid:    DAILY_JID,
    prompt: 'Run your scheduled T1 daily briefing.',
    label:  'T1 growth         8:00 AM Mon–Fri',
  },
  {
    folder: 'barwon-finance',
    cron:   '30 8 * * 1-5',
    jid:    DAILY_JID,
    prompt: 'Run your scheduled T1 daily briefing.',
    label:  'T1 finance        8:30 AM Mon–Fri',
  },
  {
    folder: 'barwon-research',
    cron:   '0 18 * * 1-5',
    jid:    DAILY_JID,
    prompt: 'Run your scheduled T1 daily briefing.',
    label:  'T1 research       6:00 PM Mon–Fri',
  },

  // ── T2 Weekly intelligence ───────────────────────────────────────────────
  {
    folder: 'barwon-infra',
    cron:   '0 9 * * 1',
    jid:    WEEKLY_JID,
    prompt: 'Run your scheduled T2 weekly briefing.',
    label:  'T2 infra          Mon 9:00 AM',
  },
  {
    folder: 'barwon-feedback',
    cron:   '0 9 * * 2',
    jid:    WEEKLY_JID,
    prompt: 'Run your scheduled T2 weekly briefing.',
    label:  'T2 feedback       Tue 9:00 AM',
  },
  {
    folder: 'barwon-data',
    cron:   '0 9 * * 3',
    jid:    WEEKLY_JID,
    prompt: 'Run your scheduled T2 weekly briefing.',
    label:  'T2 data           Wed 9:00 AM',
  },
  {
    folder: 'barwon-data-agg',
    cron:   '30 9 * * 3',
    jid:    WEEKLY_JID,
    prompt: 'Run your scheduled T2 weekly briefing.',
    label:  'T2 data-agg       Wed 9:30 AM',
  },
  {
    folder: 'barwon-experiments',
    cron:   '0 9 * * 4',
    jid:    WEEKLY_JID,
    prompt: 'Run your scheduled T2 weekly briefing.',
    label:  'T2 experiments    Thu 9:00 AM',
  },
  {
    folder: 'barwon-pipeline',
    cron:   '0 9 * * 5',
    jid:    WEEKLY_JID,
    prompt: 'Run your scheduled T2 weekly briefing.',
    label:  'T2 pipeline       Fri 9:00 AM',
  },
  {
    folder: 'barwon-weekly',
    cron:   '0 17 * * 5',
    jid:    WEEKLY_JID,
    prompt: 'Run your scheduled T2 weekly briefing.',
    label:  'T2 weekly         Fri 5:00 PM',
  },
];

const db = new Database(dbPath);

const insert = db.prepare(`
  INSERT OR REPLACE INTO scheduled_tasks
    (id, group_folder, chat_jid, prompt, schedule_type, schedule_value,
     next_run, status, created_at, context_mode)
  VALUES
    (?, ?, ?, ?, 'cron', ?, ?, 'active', ?, 'isolated')
`);

const now = new Date().toISOString();

console.log('Registering 12 scheduled tasks...\n');

for (const t of tasks) {
  const interval = CronExpressionParser.parse(t.cron, { tz: TZ });
  const nextRun = interval.next().toISOString();
  const id = randomUUID();

  insert.run(id, t.folder, t.jid, t.prompt, t.cron, nextRun, now);
  console.log(`✓  ${t.label}`);
  console.log(`   next: ${new Date(nextRun).toLocaleString('en-AU', { timeZone: TZ })}\n`);
}

// Verify
const rows = db.prepare(`
  SELECT group_folder, schedule_value, chat_jid, status, next_run
  FROM scheduled_tasks
  ORDER BY schedule_value
`).all();

console.log('─'.repeat(60));
console.log(`\nAll tasks in DB (${rows.length}):\n`);
for (const r of rows) {
  const chan = r.chat_jid === DAILY_JID  ? '#daily'
             : r.chat_jid === WEEKLY_JID ? '#weekly'
             : r.chat_jid === FLAGS_JID  ? '#flags'
             : r.chat_jid;
  console.log(`  ${r.group_folder.padEnd(22)} ${r.schedule_value.padEnd(16)} → ${chan}  [${r.status}]`);
}

db.close();
