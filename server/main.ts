import "./core/extensions/promise.ts";
import { CorsMiddleware } from "./cors_middleware.ts";
import { WebServer } from "./web_server.ts";
import { AuthMiddleware } from "./auth_middleware.ts";
import { getMapWithDupes } from "./core/map.ts";
import {
  addDaysToHealthStore,
  getNewItem,
  HealthStore,
  mergeDays,
  mergeLogs,
  validateHealthRoot,
} from "./health/merge.ts";
import { HealthService } from "./health/health_service.ts";

console.log("Loading configs...");
const appToken = Deno.env.get("health_token");
if (!appToken) {
  throw new Error("auth 'health_token' required");
}

const port = +(Deno.args[0] ?? 8080);
const app = new WebServer();
// const storageDir = (await getStorageDir());
// const healthService = new HealthService(storageDir);
const healthService = new HealthService((await getStorageDir()));

const origins = [
  "http://localhost:4200",
  "http://192.168.1.58:4200",
  "https://statichostsharp.z13.web.core.windows.net",
];
app.use(new CorsMiddleware(origins));
app.use(new AuthMiddleware(appToken));

app.get("/test", (req, res) => {
  const obj = {
    data: "how bout json",
    x: 12,
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
  validateHealthRoot(json);
  Deno.writeTextFile(`data/${new Date().toISOString()}.json`, body)
    .spawn();
});

app.post("/healthExportSmart", async (req, res, body) => {
  const postData = JSON.parse(body);
  validateHealthRoot(postData);

  const healthStore = await healthService.loadHealthStore();

  const daysResult = mergeDays(healthStore, postData.days);
  if ("error" in daysResult) {
    res.status = daysResult.error.status;
    res.body = daysResult.error.body;
    return;
  }

  const logsResult = mergeLogs(healthStore, postData.logs);
  if ("error" in logsResult) {
    res.status = logsResult.error.status;
    res.body = logsResult.error.body;
    return;
  }

  if (daysResult.ok || logsResult.ok) {
    healthService.saveHealthStore(healthStore);
  }

  const resMsg =
    `added '${daysResult.ok}' days & '${logsResult.ok}' logs to store`;
  console.log(resMsg);
  res.body = resMsg;
});

async function getStorageDir() {
  const storageDir = Deno.env.get("health_storage_dir");
  if (!storageDir) throw new Error("must provide 'health_storage_dir'");

  return Deno.stat(storageDir).then((s) => {
    if (!s.isDirectory) {
      throw new Error(`'${storageDir}' is not a directory`);
    }
    return storageDir;
  })
    .catch((err) => {
      throw new Error(`storage dir '${storageDir}' invalid`);
    });
}

app.listen();
console.log(`server running on http://localhost:${port}`);
