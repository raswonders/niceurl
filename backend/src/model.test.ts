import { test, expect } from "bun:test";
import { Database } from "bun:sqlite";
import model from "./model";

const dbPath = "../mydb.sqlite";
const db = new Database(dbPath);

test("database exists", async () => {
  const dbExists = await Bun.file(dbPath).exists();
  expect(dbExists).toBe(true);
});

test("database has table named urls", () => {
  const result = db
    .query(`SELECT name FROM sqlite_master WHERE type="table" AND name="urls";`)
    .get();
  expect(result).toEqual({ name: "urls" });
});

test("insert a url", () => {
  const result = model.insert("TESTTEST", "http://example.com");
  expect(result).toBeGreaterThan(0);

  // clean-up
  if (typeof result === "number") {
    db.query(`DELETE FROM urls WHERE id == $id;`).run({ $id: result });
  }
});
