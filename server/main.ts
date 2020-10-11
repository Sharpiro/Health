import { CorsMiddleware } from "./cors_middleware.ts";
import { WebServer } from "./web_server.ts";
import "./promise_extensions.ts";
import { AuthMiddleware } from "./auth_middleware.ts";

await Deno.mkdir("data", { recursive: true });

const port = +(Deno.args[0] ?? 8080);
const app = new WebServer();
const appToken = Deno.env.get("token");
if (!appToken) {
  throw new Error("auth token required");
}

const origins = [
  "http://localhost:4200",
  "https://statichostsharp.z13.web.core.windows.net"
];
app.use(new CorsMiddleware(origins));
app.use(new AuthMiddleware(appToken));

app.get("/test", (req, res) => {
  const obj = {
    data: "how bout json",
    x: 12
  };
  res.headers?.set("content-type", "application/json");
  res.body = JSON.stringify(obj);
});

app.get("/getHealthData", async (req, res) => {
  const data = await Deno.readTextFile("data/2020_health_data.json");
  res.headers?.set("content-type", "application/json");
  res.body = data;
});

app.post("/healthexport", (req, res, body) => {
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
