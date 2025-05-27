import { db } from '../src/db/db';
import { notes } from '../src/db/schema';
import Database from 'better-sqlite3';

function createNotesTableIfNotExists() {
  const raw = new Database('notes.db');
  raw.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL
    );
  `);
  raw.close();
}

async function init() {
  createNotesTableIfNotExists(); // 🛠️ Important: create table first

  const existing = await db.select().from(notes).limit(1);

  if (existing.length === 0) {
    console.log('⏳ No notes found — inserting seed note...');
    await db.insert(notes).values({
      title: 'Hello World',
      content: 'This is your first note!',
    });
    console.log('✅ Notes table seeded.');
  } else {
    console.log('✅ Notes already exist. No action taken.');
  }
}

init().catch((err) => {
  console.error('❌ Failed to init DB:', err);
  process.exit(1);
});