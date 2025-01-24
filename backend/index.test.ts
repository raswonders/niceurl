import { expect, test } from "bun:test";

test("/shorten returns correct data", async () => {
  const options = {
    method: "POST",
    body: JSON.stringify({ url: "http://example.com" }),
  }
  const url = "localhost:3000/shorten"
  const response = await fetch(url, options)
  expect(response.ok).toBe(true)
  expect(response.status).toBe(201)
  const data = await response.json();
  console.log("data recived", data);
  expect(data).toHaveProperty("shortUrl");
  expect(data).toHaveProperty("origUrl");
})
