import { CorsMiddleware } from "./cors_middleware.ts";
import { WebServer } from "./web_server.ts";

const app = new WebServer();
app.use(new CorsMiddleware(["http://localhost:4200"]));

app.get("/", req => {
  const obj = {
    data: "how bout json",
    x: 12
  };
  const headers = new Headers([["content-type", "application/json"]]);
  const body = JSON.stringify(obj);
  return { status: 200, body: body, headers: headers };
});

app.post("/healthexport", (req, body) => {
  const json = JSON.parse(body);
  validateExportJson(json);
  Deno.writeTextFile(`data/${new Date().toISOString()}.json`, body);
  return { status: 200 };
});

function validateExportJson(json: any) {
  if (!json) {
    throw new Error("json was null");
  }
  if (!json.days) {
    throw new Error("days not present");
  }
  if (!json.logs) {
    throw new Error("logs not present");
  }
  return json;
}

console.log(`server running on http://localhost:${app.port}`);
app.listen();
