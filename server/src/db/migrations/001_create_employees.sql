CREATE TABLE IF NOT EXISTS employees (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL CHECK(length(name) <= 100),
  email TEXT NOT NULL UNIQUE CHECK(length(email) <= 255),
  position TEXT NOT NULL CHECK(length(position) <= 50),
  createdAt TEXT NOT NULL DEFAULT (datetime('now')),
  updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
);
