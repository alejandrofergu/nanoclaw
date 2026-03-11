import Database from '../node_modules/better-sqlite3/lib/index.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, '..', 'store', 'messages.db'));

const config = JSON.stringify({
  responseJid: 'dc:1480928049607344308',  // #outputs
});

const result = db.prepare(`
  UPDATE registered_groups
  SET container_config = ?
  WHERE folder = 'barwon'
`).run(config);

console.log(`Updated ${result.changes} row(s)`);

const row = db.prepare(`
  SELECT jid, name, folder, container_config FROM registered_groups WHERE folder = 'barwon'
`).get();

console.log('barwon group config:');
console.log(JSON.stringify(JSON.parse(row.container_config), null, 2));
db.close();
