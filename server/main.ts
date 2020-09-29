import { WebApp } from "./web_app.ts";

const app = new WebApp();
// app.use(["http://localhost:4200"]);
app.useCors(["http://localhost:4200"]);

app.get("/tacos", req => {
  const obj = {
    data: "how bout json",
    x: 12
  };
  const headers = new Headers([["content-type", "application/json"]]);
  const body = JSON.stringify(obj);
  return { status: 200, body: "hi" as any, headers: headers };
  // return req.respond({ status: 200, body: body, headers: headers });
});

app.post("/postdata", (req, body) => {
  const json = JSON.parse(body);
  const headers = new Headers([["content-type", "application/json"]]);
  return { status: 200, body: body, headers: headers };
});

console.log(`server running: http://localhost:8080/`);
app.listen();
