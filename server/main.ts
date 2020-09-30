import { CorsMiddleware } from "./cors_middleware.ts";
import { WebServer } from "./web_server.ts";

const port = +(Deno.args[0] ?? 8080);
const app = new WebServer(port);
app.use(new CorsMiddleware(["http://localhost:4200"]));
await Deno.mkdir("data", { recursive: true });

app.get("/", (_req, res) => {
  const obj = {
    data: "how bout json",
    x: 12
  };
  res.headers?.set("content-type", "application/json");
  res.body = JSON.stringify(obj);
});

app.post("/healthexport", async (_req, _res, body) => {
  const json = JSON.parse(body);
  validateExportJson(json);
  await Deno.writeTextFile(`data/${new Date().toISOString()}.json`, body);
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

function delayedError() {
  return new Promise((_, rej) => {
    setTimeout(() => {
      rej("fake b-ground processing error");
    }, 5_000);
  });
}