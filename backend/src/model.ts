import { Database } from "bun:sqlite";

type Row = {
  hash: string;
  url: string;
};

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

  get(hash: string) {
    try {
      const result = db
        .query(`SELECT url FROM urls WHERE hash = $hash;`)
        .get({ hash }) as Row | null;
      return result ? result.url : null;
    } catch (error) {
      console.log("Error during select \n", error);
    }
  },
};

export default api;
