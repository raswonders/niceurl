import { test, expect } from "bun:test";

test("database exists", async () => {
  const dbExists = await Bun.file("../mydb.sqlite").exists();
  expect(dbExists).toBe(true);
});
