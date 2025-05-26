import { db } from '../src/db/db';
import { notes } from '../src/db/schema';

async function init() {
  await db.run(`CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL
  )`);
  console.log('Initialized notes.db');
}

init();