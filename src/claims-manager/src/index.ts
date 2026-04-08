import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, sep, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import pino from "pino";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logger = pino({ name: "claims-manager" });

process.on("unhandledRejection", (reason) => {
  logger.error({ err: reason }, "Unhandled promise rejection");
});

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception — exiting");
  process.exit(1);
});

const versionPath = join(__dirname, "..", "version.json");
const VERSION = existsSync(versionPath) ? JSON.parse(readFileSync(versionPath, "utf-8")) : { semver: "0.0.0-dev", sha: "dev" };
logger.info({ version: VERSION }, "claims-manager version");

const PORT = parseInt(process.env.PORT ?? "8080", 10);
const STATIC_DIR = join(__dirname, "..", "public");

const MIME_TYPES: Record<string, string> = {
  ".js": "application/javascript",
  ".html": "text/html",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

/* Cache all static files at startup */
const staticCache = new Map<string, { content: Buffer; mime: string }>();

function loadDir(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      loadDir(fullPath);
    } else {
      const rel = "/" + relative(STATIC_DIR, fullPath);
      const ext = extname(entry.name);
      staticCache.set(rel, {
        content: readFileSync(fullPath),
        mime: MIME_TYPES[ext] ?? "application/octet-stream",
      });
    }
  }
}
loadDir(STATIC_DIR);

const bundleEntry = staticCache.get("/ui/claims-manager.js");
const bundleHash = bundleEntry
  ? createHash("sha256").update(bundleEntry.content).digest("hex").slice(0, 16)
  : "unknown";
logger.info({ bundleHash, cachedFiles: staticCache.size }, "Static files cached");

function json(res: ServerResponse, data: unknown, status = 200): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

function serveStatic(_req: IncomingMessage, res: ServerResponse, urlPath: string): boolean {
  const filePath = join(STATIC_DIR, urlPath);
  if (!filePath.startsWith(STATIC_DIR + sep)) { res.writeHead(403); res.end(); return true; }
  const relPath = "/" + relative(STATIC_DIR, filePath);
  const cached = staticCache.get(relPath);
  if (!cached) return false;
  res.writeHead(200, { "Content-Type": cached.mime });
  res.end(cached.content);
  return true;
}

const server = createServer((req, res) => {
  const url = req.url ?? "/";
  const urlPath = url.split("?")[0];

  if (urlPath === "/healthz") {
    json(res, { status: "ok", version: VERSION });
    return;
  }

  if (urlPath === "/ui/manifest.json") {
    json(res, { hash: bundleHash });
    return;
  }

  if (serveStatic(req, res, urlPath)) return;

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "not found" }));
});

server.listen(PORT, () => {
  logger.info({ port: PORT }, "claims-manager listening");
});

function shutdown(signal: string): void {
  logger.info({ signal }, "shutting down");
  server.close(() => { process.exit(0); });
  setTimeout(() => { process.exit(1); }, 5_000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
