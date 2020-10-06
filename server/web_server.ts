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
      const response: Response = { status: 200, headers: new Headers() };
      this.processRequest(request, response)
        .finally(() => {
          // todo: probably will be my reverse proxy
          const hostname = (request.conn.remoteAddr as Deno.NetAddr).hostname;
          console.log(hostname, request.method, request.url, response.status);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  close() {
    this.server?.close();
    this.server = undefined;
  }

  get(path: string, handler: GetReqHandler) {
    this.getHandlers.set(path, handler);
  }

  post(path: string, callback: PostReqHandler) {
    this.postHandlers.set(path, callback);
  }

  use(middleware: Middleware) {
    this.middleware.push(middleware);
  }

  private async processRequest(request: ServerRequest, response: Response) {
    try {
      for (const middleware of this.middleware) {
        middleware.next(request, response);
      }
    } catch (err) {
      await this.sendErrorResponse(request, response, 500, err.toString());
      throw err;
    }

    if (request.method === "OPTIONS") {
      return this.sendResponse(request, response);
    } else if (request.method === "GET") {
      return this.processGet(request, response);
    } else if (request.method === "POST") {
      return this.processPost(request, response);
    } else {
      return this.sendErrorResponse(request, response, 400, "Bad Request");
    }
  }

  private processGet(request: ServerRequest, response: Response) {
    const queryStart = request.url.indexOf("?");
    const handlerLookup = queryStart > -1 ?
      request.url.slice(0, queryStart) :
      request.url;
    const requestHandler = this.getHandlers.get(handlerLookup);
    if (requestHandler) {
      requestHandler(request, response);
      return this.sendResponse(request, response);
    } else {
      return this.sendErrorResponse(request, response, 404, "Not Found");
    }
  }

  private async processPost(request: ServerRequest, response: Response) {
    const contentType = request.headers.get("content-type");
    if (!contentType?.toLowerCase().includes("json")) {
      return this.sendErrorResponse(request, response, 400, "Only json content-type allowed");
    }

    const queryStart = request.url.indexOf("?");
    const handlerLookup = queryStart > -1 ?
      request.url.slice(0, queryStart) :
      request.url;
    const requestHandler = this.postHandlers.get(handlerLookup);
    if (requestHandler) {
      try {
        const bodyBuffer = await Deno.readAll(request.body);
        const bodyText = new TextDecoder().decode(bodyBuffer);

        if (!bodyText) {
          return this.sendErrorResponse(request, response, 400, "HTTP POST must have body");
        }
        await requestHandler(request, response, bodyText);

        return this.sendResponse(request, response);
      }
      catch (err) {
        return this.sendErrorResponse(request, response, 500, err?.toString());
      }
    } else {
      return this.sendErrorResponse(request, response, 404, "Not Found");
    }
  }

  private async sendErrorResponse(request: ServerRequest, response: Response, statusCode: number, message: string) {
    response.status = statusCode;
    response.body = message;
    try {
      await this.sendResponse(request, response);
    } catch (outerErr) {
      throw new Error(
        `An error occurred while sending an error -> outer: ${outerErr}` +
        `-> inner: ${message}`
      );
    }
  }

  private async sendResponse(request: ServerRequest, response: Response) {
    try {
      if (response.body && typeof response.body !== "string") {
        throw new Error("invalid response body");
      }
    }
    catch (err) {
      await request.respond({ status: 500, body: err?.toString() });
      throw err;
    }

    // todo: fails if an in-progress response already failed
    await request.respond(response);
  }
}

export type GetReqHandler = (req: ServerRequest, res: Response) => void | Promise<void>;
export type PostReqHandler = (req: ServerRequest, res: Response, body: string) => void | Promise<void>;

export interface Middleware {
  next(request: ServerRequest, response: Response): void;
}