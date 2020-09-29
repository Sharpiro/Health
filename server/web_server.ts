import { serve, Server, ServerRequest, Response } from "https://deno.land/std@0.71.0/http/server.ts";

export class WebServer {
  private server?: Server;
  private getHandlers = new Map<string, GetReqHandler>();
  private postHandlers = new Map<string, PostReqHandler>();
  private middleware: Middleware[] = [];

  constructor(readonly port: number = 8080) { }

  async listen() {
    if (this.server) return;

    this.server = serve({ hostname: "0.0.0.0", port: this.port });
    for await (const request of this.server) {
      console.log(request.method, request.url);
      this.processRequest(request)
        .catch(err => {
          console.error(err);
          console.error("response failed, need to log");
        });
    }
  }

  close() {
    this.server?.close();
    this.server = undefined;
  }

  get(path: string, callback: GetReqHandler) {
    this.getHandlers.set(path, callback);
  }

  post(path: string, callback: PostReqHandler) {
    this.postHandlers.set(path, callback);
  }

  use(middleware: Middleware) {
    this.middleware.push(middleware);
  }

  private processRequest(request: ServerRequest): Promise<boolean> {
    if (request.method === "OPTIONS") {
      return this.sendResponse(request, { status: 200 });
    } else if (request.method === "GET") {
      return this.processGet(request);
    } else if (request.method === "POST") {
      return this.processPost(request);
    } else {
      return this.sendResponse(request, { status: 400, body: "Bad Request" });
    }
  }

  private processGet(request: ServerRequest) {
    const requestHandler = this.getHandlers.get(request.url);
    if (requestHandler) {
      const response = requestHandler(request);
      return this.sendResponse(request, response);
    } else {
      return this.sendResponse(request, { status: 404, body: "Not Found" });
    }
  }

  private async processPost(request: ServerRequest) {
    const contentType = request.headers.get("content-type");
    if (!contentType?.toLowerCase().includes("json")) {
      return this.sendResponse(request, { status: 400, body: "Only json content-type allowed" });
    }

    const requestHandler = this.postHandlers.get(request.url);
    if (requestHandler) {
      try {
        const body = await Deno.readAll(request.body);
        const text = new TextDecoder().decode(body);
        const response = requestHandler(request, text);

        return this.sendResponse(request, response);
      }
      catch (err) {
        return this.sendResponse(request, { status: 500, body: err?.toString() });
      }
    } else {
      return this.sendResponse(request, { status: 404, body: "Not Found" });
    }
  }

  private async sendResponse(request: ServerRequest, response: Response) {
    try {
      for (const middleware of this.middleware) {
        middleware.next(request, response);
      }

      if (response.body && typeof response.body !== "string") {
        throw new Error("invalid response body");
      }
      await request.respond(response);
      return true;
    }
    catch (err) {
      // todo: fails if an in-progress response already failed
      try {
        await request.respond({
          status: 500,
          body: err?.toString(),
          headers: response.headers
        });
        return true;
      } catch (innerErr) {
        throw new Error(`${innerErr}|${err}`);
      }
    }
  }
}

export type GetReqHandler = (req: ServerRequest) => Response;
export type PostReqHandler = (req: ServerRequest, body: string) => Response;

export interface Middleware {
  next(request: ServerRequest, response: Response): void;
}