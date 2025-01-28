const urlMap: {[key: string]: string} = {
  "12345": "https://www.amazon.com/Debugging-Indispensable-Software-Hardware-Problems/dp/0814474578/?_encoding=UTF8&pd_rd_w=1O2Hp&content-id=amzn1.sym.c2cf8313-b86b-4327-9de4-9398adaa570b%3Aamzn1.symc.a68f4ca3-28dc-4388-a2cf-24672c480d8f&pf_rd_p=c2cf8313-b86b-4327-9de4-9398adaa570b&pf_rd_r=TZN7AMJN12XQJZ93R7EA&pd_rd_wg=qT7bB&pd_rd_r=06d8645c-b535-4e69-a363-538409ad0514&ref_=pd_hp_d_atf_ci_mcx_mr_ca_hp_atf_d"
}

Bun.serve({
  async fetch(req) {
    console.log(req);
    let res: Response;

    try {
      if (req.method === "GET") {
        res = await GET(req);
      } else if (req.method === "POST") {
        res = await POST(req);
      } else {
        res = new Response("400 Bad request", {status: 400});
      }
    } catch (error) {
      console.log("Error has occurred:\n", error)
      res = new Response("500 Internal server error", {status: 500})
    }

    console.log(res);
    return res;
  }
})

async function GET(req: Request) {
  const urlShort = new URL(req.url);
  const key = urlShort.pathname.slice(1);
  const urlLong = urlMap[key];
  if (urlLong) {
    return Response.redirect(urlLong);
  } else {
    return new Response("404 Not Found", {status: 404});
  }
}

async function POST(req: Request) {
  const url = new URL(req.url);
  if (url.pathname === "/shorten") {
    let data;
    try {
      data = await req.json();
    } catch (error) {
      return new Response("Invalid JSON input", {status: 400})
    }

    if (!data.url) {
      return new Response("Missing 'url' in request", {status: 400})
    }
    const hex = Bun.hash(data.url).toString(16).slice(0,8);
    const body = JSON.stringify({origUrl: data.url, shortUrl: `${url.hostname}/${hex}`});
    return new Response(body, {status: 201});
  } else {
    return new Response("400 Bad request", {status: 400});
  }
}
