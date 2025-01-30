import { Database } from "bun:sqlite";

const db = new Database("../mydb.sqlite", { create: true, strict: true });

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS urls (
  id INTEGER PRIMARY KEY,
  hash TEXT UNIQUE,
  url TEXT,
  creation_date DATE DEFAULT CURRENT_DATE);`;

db.exec(createTableQuery);

const api = {
  insert() {},
};

export default api;
