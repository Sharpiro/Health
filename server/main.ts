import { CorsMiddleware } from "./cors_middleware.ts";
import { WebServer } from "./web_server.ts";
import "./promise_extensions.ts";

const port = +(Deno.args[0] ?? 8080);
const app = new WebServer(port);
const origins = [
  "http://localhost:4200",
  "https://statichostsharp.z13.web.core.windows.net"
];
app.use(new CorsMiddleware(origins));
await Deno.mkdir("data", { recursive: true });

app.get("/test", (_req, res) => {
  const obj = {
    data: "how bout json",
    x: 12
  };
  res.headers?.set("content-type", "application/json");
  res.body = JSON.stringify(obj);
});

app.post("/healthexport", (_req, _res, body) => {
  const json = JSON.parse(body);
  validateExportJson(json);
  Deno.writeTextFile(`data/${new Date().toISOString()}.json`, body)
    .spawn();
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

app.listen();
console.log(`server running on http://localhost:${port}`);
