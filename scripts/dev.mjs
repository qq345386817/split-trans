import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, extname } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const port = Number(process.env.PORT || 4173);
const mime = { ".html": "text/html", ".css": "text/css", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".xml": "application/xml", ".txt": "text/plain" };
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    if (pathname.split("/").some(part => part.startsWith(".")) || pathname.includes("node_modules") || pathname.includes("scripts")) throw new Error("not_found");
    let file = resolve(root, `.${pathname}`);
    if (!file.startsWith(root)) throw new Error("not_found");
    const info = await stat(file).catch(() => null);
    if (info?.isDirectory()) file += "/index.html";
    else if (!extname(file)) file += ".html";
    let data = await readFile(file);
    if (extname(file) === ".html" && process.env.STUDY_API_URL) data = Buffer.from(data.toString().replace("https://quote.luopeike.com/study/analyze", process.env.STUDY_API_URL));
    res.writeHead(200, { "content-type": `${mime[extname(file)] || "application/octet-stream"}; charset=utf-8`, "cache-control": "no-store" });
    res.end(data);
  } catch { res.writeHead(404); res.end("Not found"); }
}).listen(port, "127.0.0.1", () => console.log(`PhraseCut website: http://127.0.0.1:${port}/zh-hans/study`));
