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
  insert(hash: string, url: string) {
    try {
      const result = db
        .query(`INSERT INTO urls(hash, url) VALUES($hash, $url);`)
        .run({ hash, url });
      return result.changes;
    } catch (error) {
      console.log("Error during insert \n", error);
    }
  },
};

export default api;
