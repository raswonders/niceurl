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

test("get url for hash", () => {
  // setup
  const hash = "TESTTEST";
  const url = "http://example.com";
  model.insert(hash, url);

  const result = model.get(hash);
  expect(result).toBe(url);

  // clean-up
  db.query(`DELETE FROM urls WHERE hash = $hash;`).run({ $hash: hash });
});

test("get null for nonexistent hash", () => {
  const result = model.get("nonexistent");
  expect(result).toBe(null);
});
