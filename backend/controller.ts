import { Database } from "bun:sqlite";

const db = new Database("mydb.sqlite", { create: true, strict: true });
db.query(
  `
  CREATE TABLE IF NOT EXISTS records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hex_string TEXT UNIQUE,
    url TEXT,
    creation_date DATE 
  );
`,
).run();

const api = {};

export default api;
