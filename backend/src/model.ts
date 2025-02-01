import { Database } from "bun:sqlite";
import path from "path";

type Row = {
  hash: string;
  url: string;
};

const dbPath = path.join(import.meta.dir, "../mydb.sqlite");
const db = new Database(dbPath, { strict: true });

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
      return -1;
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
      return -1;
    }
  },

  delete(hash: string) {
    try {
      const result = db
        .query(`DELETE FROM urls WHERE hash = $hash;`)
        .run({ hash });
      return result.changes;
    } catch (error) {
      console.log("Error during delete \n", error);
      return -1;
    }
  },

  update(hash: string, url: string) {
    try {
      const result = db
        .query(`UPDATE urls SET url = $url WHERE hash = $hash;`)
        .run({ hash, url });
      return result.changes;
    } catch (error) {
      console.log("Error during update\n", error);
      return -1;
    }
  },
};

export default api;
