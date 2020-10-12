import {
  ServerRequest,
  Response,
} from "https://deno.land/std@0.71.0/http/server.ts";
import { Middleware } from "./web_server.ts";

export class CorsMiddleware implements Middleware {
  allowedOrigins: Set<string>;

  constructor(allowedOrigins: string[]) {
    this.allowedOrigins = new Set(allowedOrigins);
  }

  next(request: ServerRequest, response: Response): void {
    const requestOrigin = request.headers.get("Origin");
    if (requestOrigin && this.allowedOrigins.has(requestOrigin)) {
      response.headers = response.headers ?? new Headers();
      response.headers.set("Access-Control-Allow-Origin", requestOrigin);
      response.headers.set("Access-Control-Allow-Headers", "*");
    }
  }
}
