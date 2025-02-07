import db from "./model";

Bun.serve({
  async fetch(req) {
    console.log(req);
    let res: Response;

    try {
      if (req.method === "GET") {
        res = await GET(req);
      } else if (req.method === "POST") {
        res = await POST(req);
      } else if (req.method === "OPTIONS") {
        res = await OPTIONS(req);
      } else {
        res = new Response("400 Bad request", { status: 400 });
      }
    } catch (error) {
      console.log("Error has occurred:\n", error);
      res = new Response("500 Internal server error", { status: 500 });
    }

    console.log(res);
    return res;
  },
});

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 204, 
    headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}

export async function GET(req: Request) {
  const urlShort = new URL(req.url);
  const key = urlShort.pathname.slice(1);
  const urlLong = db.get(key);

  if (typeof urlLong === "string") {
    return Response.redirect(urlLong);
  } else if (urlLong === -1) {
    return new Response("500 Internal server error", { status: 500 });
  } else {
    return new Response("404 Not Found", { status: 404 });
  }
}

export async function POST(req: Request) {
  const url = new URL(req.url);

  if (url.pathname === "/shorten") {
    let data;
    try {
      data = await req.json();
    } catch (error) {
      return new Response("Invalid JSON input", { status: 400 });
    }

    if (!data.url) {
      return new Response("Missing 'url' in request", { status: 400 });
    }

    const hex = Bun.hash(data.url).toString(16).slice(0, 8);
    const result = db.insert(hex, data.url);
    if (result === -1) {
      return new Response("500 Internal server error", { status: 500 });
    }

    const body = JSON.stringify({
      origUrl: data.url,
      hostname: url.hostname,
      hash: hex, 
    });
    return new Response(body, { status: 201, headers: { "Content-Type": "application/json" } });
  } else {
    return new Response("400 Bad request", { status: 400 });
  }
}
