import { Middleware } from "./web_server.ts";
import {
  ServerRequest,
  Response,
} from "https://deno.land/std@0.71.0/http/server.ts";

export class AuthMiddleware implements Middleware {
  constructor(private appToken: string) {}

  next(request: ServerRequest, response: Response) {
    if (request.method === "OPTIONS") return;

    const requestToken = request.headers.get("token");
    const queryToken = this.getTokenQueryTemp(request.url);
    if (!requestToken && !queryToken) {
      response.status = 401;
      response.body = "Authentication required";
      return;
    }

    if (requestToken && requestToken !== this.appToken) {
      response.status = 401;
      response.body = "Invalid  request token";
      return;
    }

    if (queryToken && queryToken !== this.appToken) {
      response.status = 401;
      response.body = "Invalid query token";
      return;
    }
  }

  private getTokenQueryTemp(url: string): string | undefined {
    return (url.match(/(?<=token=)[^&\s]+/) ?? [])[0];
  }
}
