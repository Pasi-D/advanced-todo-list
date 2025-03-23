import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// Ensure the data directory exists
const dataDir = path.join(__dirname, "../../data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const dbPath = path.join(dataDir, "todo.sqlite");
const db = new Database(dbPath);

// Initialize database with required tables
const initDatabase = () => {
  const tasksTable = `
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        priority TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        recurrence TEXT NOT NULL DEFAULT 'none',
        dueDate TEXT,
        dependsOn TEXT
      )
    `;

  db.exec(tasksTable);
  console.info("Database initialized");
};

export { db, initDatabase };
