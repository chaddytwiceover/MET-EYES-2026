import type { IncomingMessage, ServerResponse } from "node:http";
import app from "../server";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || "/api", "http://localhost");
  const routedPath = url.searchParams.get("path");

  if (routedPath) {
    url.searchParams.delete("path");
    const query = url.searchParams.toString();
    req.url = `/api/${routedPath}${query ? `?${query}` : ""}`;
  }

  return app(req, res);
}
