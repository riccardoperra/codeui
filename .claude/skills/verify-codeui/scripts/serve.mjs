#!/usr/bin/env node
// Static file server for a Storybook build. Same approach as tools/baseline/run.mjs:
// bind port 0 so the OS reserves a free port, then print the URL.
// Usage: node serve.mjs <storybook-static-dir>
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const base = path.resolve(process.argv[2]);
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
	try {
		let p = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
		if (p.endsWith("/")) p += "index.html";
		const f = path.resolve(base, "." + p);
		if (!f.startsWith(base + path.sep)) throw Error("path");
		const body = await readFile(f);
		res.setHeader("Content-Type", types[path.extname(f)] || "application/octet-stream");
		res.end(body);
	} catch {
		res.statusCode = 404;
		res.end();
	}
});
server.listen(0, "127.0.0.1", () => console.log(`listening http://127.0.0.1:${server.address().port}`));
