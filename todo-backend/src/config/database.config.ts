import Database, { Database as IDatabase } from "better-sqlite3";
import fs from "fs";
import path from "path";

const TEST_DB_NAME = "test.sqlite";
const DATA_DB_NAME = "todo.sqlite";

// Function to get a database instance
const getDatabase = (dbName: string = DATA_DB_NAME) => {
  const dataDir = path.join(__dirname, "../../data");

  // Ensure the data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const dbPath = path.join(dataDir, dbName);
  return new Database(dbPath);
};

// Initialize database with required tables
const initDatabase = (db: IDatabase) => {
  const tablesExist = db
    .prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='tasks';`)
    .get();

  if (!tablesExist) {
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
    console.info("Database initialized 🫙");
  } else {
    console.info("Database already initialized ✅");
  }
};

export { getDatabase, initDatabase, TEST_DB_NAME };
