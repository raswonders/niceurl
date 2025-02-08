import { test, expect, describe, beforeEach } from "bun:test";
import { Database } from "bun:sqlite";
import model from "./model";
import path from "path";

const dbPath = path.join(path.resolve(__dirname), "../mydb.sqlite");
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

describe("api", () => {
  const hash = "TESTTEST";
  const url = "http://example.com";
  const url2 = "http://example2.com";

  beforeEach(() => {
    db.query(`DELETE FROM urls WHERE hash == $hash;`).run({ $hash: hash });
  });

  test("insert a url", () => {
    const result = model.insert(hash, url);
    expect(result).toBeGreaterThan(0);
  });

  test("get url for hash", () => {
    // setup
    model.insert(hash, url);

    const result = model.get(hash);
    expect(result).toBe(url);
  });

  test("get null for nonexistent hash", () => {
    const result = model.get("nonexistent");
    expect(result).toBe(null);
  });

  test("delete a hash", () => {
    // setup
    model.insert(hash, url);

    const result = model.delete(hash);
    expect(result).toBeGreaterThan(0);
  });

  test("update url for a hash", () => {
    // setup
    model.insert(hash, url);

    expect(model.update(hash, url2)).toBeGreaterThan(0);
    expect(model.get(hash)).toBe(url2);
  });
});
