import "./promise_extensions.ts";
import { CorsMiddleware } from "./cors_middleware.ts";
import { WebServer } from "./web_server.ts";
import { AuthMiddleware } from "./auth_middleware.ts";
import { getMapWithDupes } from "./core/map.ts";
import { addDaysToDatastore, getNewDays, HealthRoot } from "./merge.ts";

const storageDir = (await getStorageDir());

const appToken = Deno.env.get("health_token");
if (!appToken) {
  throw new Error("auth 'health_token' required");
}

const port = +(Deno.args[0] ?? 8080);
const app = new WebServer();

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
  const json = JSON.parse(body);
  validateHealthRoot(json);

  const { map: newDataMap, dupes } = getMapWithDupes(json.days, "timestamp");
  if (dupes.length) {
    res.status = 403;
    res.body = "posted data contained duplicates";
    return;
  }

  const syncFileName = "health_data.json";
  const syncFilePath = `${storageDir}/${syncFileName}`;
  const storedText = await Deno.readTextFile(syncFilePath);
  const persistentHealthRoot = JSON.parse(storedText);
  validateHealthRoot(persistentHealthRoot);
  const { map: persistentMap, dupes: persistentDupes } = getMapWithDupes(
    persistentHealthRoot.days,
    "timestamp",
  );
  if (persistentDupes.length) {
    res.status = 403;
    res.body = "stored data contained duplicates";
    return;
  }

  const newDays = [...getNewDays(persistentMap, newDataMap)];
  if (!newDays.length) {
    res.status = 200;
    res.body = "no days to update";
    return;
  }

  console.log(`adding '${newDays.length}' days to store`);

  addDaysToDatastore(persistentHealthRoot, persistentMap, newDays);

  const backupFilePath = `${storageDir}/${
    new Date().toISOString()
  }_${syncFileName}`;
  await Deno.copyFile(syncFilePath, backupFilePath);
  await Deno.writeTextFile(
    syncFilePath,
    JSON.stringify(persistentHealthRoot),
  );
  res.body = `added '${newDays.length}' days to store`;
});

function validateHealthRoot(json: any): asserts json is HealthRoot {
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
