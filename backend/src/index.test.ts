import { test, describe, expect, beforeEach } from "bun:test";
import { GET, POST } from "./index"
import db from "./model";

const hash = "TESTTEST";
const url = "http://example.com"

describe("GET endpoint", () => {
  beforeEach(() => {
    db.delete(hash);
  })

  test("redirects when url exists", async () => {
    // setup
    db.insert(hash, url);
    const req = new Request(`http://localhost/${hash}`, { method: "GET" });

    const res = await GET(req);

    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe(url);
  });

  test("returns 404 for non-existing url", async () => {
    const req = new Request("http://localhost/NONEXISTENT", { method: "GET" });
    const res = await GET(req);

    expect(res.status).toBe(404);
  });
});

describe("POST endpoint", async () => {
  test("returns 400 when missing url parameter", async () => {
    const data = { missing: "url" }
    const req = new Request("htt://localhost/shorten", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const res = await POST(req);

    expect(res.status).toBe(400);
  })

  test("returns 400 on invalid JSON", async () => {
    const req = new Request("htt://localhost/shorten", { method: "POST", headers: { "Content-Type": "application/json" }, body: `{ not valid }` });
    const res = await POST(req);

    expect(res.status).toBe(400);
  })

  test("returns 400 when bad api is used", async () => {
    const data = { missing: "url" }
    const req = new Request("htt://localhost/shor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const res = await POST(req);

    expect(res.status).toBe(400);
  })

  test("creates shorten url record", async () => {
    let resData;
    try {
      const data = { url: "http://example.com" }
      const req = new Request("htt://localhost/shorten", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const res = await POST(req);
      resData = await res.json();
      expect(res.status).toBe(201);
      console.log(db.get(resData.hash));
      expect(db.get(resData.hash)).not.toBe(null);
    } finally {
      if (resData) {
        db.delete(resData.hash)
      }
    }
  })
})
