import { db, initDatabase } from "../config/database";
import path from "path";
import fs from "fs";

// Use a test database file
const testDbPath = path.join(__dirname, "../../data/test.sqlite");

// Before all tests
beforeAll(() => {
  // Delete the test database if it exists
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  // Make sure the data directory exists
  const dataDir = path.join(__dirname, "../../data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  // Initialize a fresh test database
  initDatabase();
});

// Clean up database between tests
afterEach(() => {
  // Delete all tasks
  db.exec("DELETE FROM tasks");
});

// Close database connection after all tests
afterAll(() => {
  db.close();
});
