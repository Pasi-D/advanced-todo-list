import { Database } from "better-sqlite3";
import { getDatabase, initDatabase, TEST_DB_NAME } from "../config/database.config";

let db: Database | null = null;

beforeAll(() => {
  // Reinitialize the database
  db = getDatabase(TEST_DB_NAME);
  initDatabase(db);
});

// Clean up database between tests
afterEach(() => {
  // Delete all tasks
  db?.exec("DELETE FROM tasks");
});

// Close database connection after all tests
afterAll(() => {
  db?.close();
});
