import { serve, ServerRequest } from "https://deno.land/std@0.71.0/http/server.ts";

const server = serve({ hostname: "0.0.0.0", port: 8080 });
console.log(`HTTP webserver running.  Access it at:  http://localhost:8080/`);

for await (const request of server) {
  if (request.method === "POST") {
    validatePost(request);
  }
  switch (request.url) {
    case "/tacos": tacos(request); break;
    case "/postdata": postData(request); break;
    default:
      request.respond({ status: 404, body: "Not Found" });
  }
}

function tacos(request: ServerRequest) {
  const obj = {
    data: "how bout json"
  };
  const headers = new Headers([["content-type", "application/json"]]);
  const body = JSON.stringify(obj);
  request.respond({ status: 200, body: body, headers: headers });
}

function validatePost(request: ServerRequest) {
  const contentType = request.headers.get("content-type");
  console.log("content-type:", contentType);
  if (!contentType?.includes("json")) {
    request.respond({ status: 400, body: "Bad Request" });
    return;
  }
  postData(request);
}

async function postData(request: ServerRequest) {
  const data = await Deno.readAll(request.body);
  const text = new TextDecoder().decode(data);
  console.log(text);
  const json = JSON.parse(text);
  console.log(json);
  request.respond({ status: 200 });
}


fetch("", {
  body: "",
  method: "GET"
});