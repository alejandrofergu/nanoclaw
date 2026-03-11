import Database from '../node_modules/better-sqlite3/lib/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'store', 'messages.db');

const db = new Database(dbPath);

db.prepare(`
  INSERT OR REPLACE INTO registered_groups
    (jid, name, folder, trigger_pattern, added_at, container_config, requires_trigger, is_main)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'dc:1480893956471394367',
  'Barwon #requests',
  'barwon',
  '^@Barwon\\b',
  new Date().toISOString(),
  JSON.stringify({}),
  1,
  0
);

const rows = db.prepare('SELECT jid, name, folder, trigger_pattern, requires_trigger FROM registered_groups').all();
console.log('Registered groups:');
console.log(JSON.stringify(rows, null, 2));
db.close();
