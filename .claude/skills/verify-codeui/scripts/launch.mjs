#!/usr/bin/env node
// Start a Storybook instance owned by this run and wait until a story renders.
// Usage: node launch.mjs [--dev] [--rebuild]
//   default: build Storybook statically (only when missing or older than source) and serve it on a free port
//   --dev:   run `storybook dev` on a free port (HMR, for iteration)
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";
import { openSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { alive, baseline, buildMtime, ensureWork, flag, root, runsDir, sourceMtime, staticDir, storyIndex, work } from "./lib.mjs";

await ensureWork();
const dev = flag("dev", false) === true;
const runId = `${new Date().toISOString().replace(/[-:]/g, "").replace(/\..*/, "")}-${process.pid}`;
const log = path.join(runsDir, `${runId}.log`);
const env = { ...process.env, CI: "true", STORYBOOK_DISABLE_TELEMETRY: "1" };
const sb = ["--filter", "@codeui/storybook-playground", "exec", "storybook"];

if (spawnSync("node", ["-e", "import('playwright')"], { cwd: path.join(root, "tools/baseline") }).status) {
	console.log("Installing tools/baseline (Playwright, axe)...");
	spawnSync("npm", ["ci", "--prefix", "tools/baseline", "--workspaces=false"], { cwd: root, stdio: "inherit" });
}

let child;
if (dev) {
	const port = await new Promise(resolve => {
		const s = createServer().listen(0, "127.0.0.1", () => {
			const { port } = s.address();
			s.close(() => resolve(port));
		});
	});
	child = spawn("pnpm", [...sb, "dev", "-p", String(port), "--exact-port", "--ci", "--no-open", "--disable-telemetry"], {
		cwd: root, env, detached: true, stdio: ["ignore", openSync(log, "a"), openSync(log, "a")],
	});
} else {
	if (flag("rebuild", false) || (await buildMtime()) < (await sourceMtime())) {
		console.log(`Building Storybook into ${path.relative(root, staticDir)} (log: ${path.relative(root, log)})...`);
		const fd = openSync(log, "a");
		const build = spawnSync("pnpm", [...sb, "build", "--output-dir", staticDir, "--disable-telemetry"], { cwd: root, env, stdio: ["ignore", fd, fd] });
		if (build.status) throw Error(`Storybook build failed, see ${log}`);
	}
	child = spawn("node", [path.join(import.meta.dirname, "serve.mjs"), staticDir], {
		detached: true, stdio: ["ignore", openSync(log, "a"), openSync(log, "a")],
	});
}
child.unref();
const state = { runId, mode: dev ? "dev" : "static", pid: child.pid, log, startedAt: new Date().toISOString() };
await writeFile(path.join(runsDir, `${runId}.json`), JSON.stringify(state, null, 2));

const deadline = Date.now() + (dev ? 180_000 : 30_000);
const fail = msg => {
	console.error(`${msg}. Log: ${log}. Clean up with: node ${path.relative(root, import.meta.dirname)}/cleanup.mjs --run ${runId}`);
	process.exit(1);
};
while (!state.url) {
	if (!alive(child.pid)) fail("Server exited before listening");
	if (Date.now() > deadline) fail("Timed out waiting for a port");
	const text = await readFile(log, "utf8");
	const m = text.match(/listening (http:\/\/127\.0\.0\.1:\d+)/) || (dev && text.match(/Local:\s+(http:\/\/[^\s/]+)/));
	if (m) state.url = m[1].replace("localhost", "127.0.0.1");
	else await new Promise(r => setTimeout(r, 300));
}
state.port = Number(new URL(state.url).port);
await writeFile(path.join(runsDir, `${runId}.json`), JSON.stringify(state, null, 2));

// Ready = the story index loads AND a story renders in the requested theme.
let entries = [];
while (!entries.length) {
	if (Date.now() > deadline) fail("index.json never listed stories");
	entries = await storyIndex(state.url).catch(() => []);
	if (!entries.length) await new Promise(r => setTimeout(r, 500));
}
const probe = entries.find(e => e.id === "designsystem-button--primary") ?? entries.find(e => e.type === "story");
const { launch, open } = await baseline(state.url);
const browser = await launch();
try {
	// The dev server optimizes deps on the first request, which can outlast one open() timeout.
	for (let ok = false; !ok; ) {
		try {
			const { context, rendered, errors } = await open(browser, probe, "dark");
			await context.close();
			if (!rendered || errors.length) fail(`Probe story ${probe.id} did not render: ${errors.join("; ")}`);
			ok = true;
		} catch (e) {
			if (Date.now() > deadline) fail(`Probe story ${probe.id} never rendered: ${e.message.split("\n")[0]}`);
		}
	}
} finally {
	await browser.close();
}
state.stories = entries.filter(e => e.type === "story").length;
state.readyAt = new Date().toISOString();
await writeFile(path.join(runsDir, `${runId}.json`), JSON.stringify(state, null, 2));
console.log(JSON.stringify({ ready: true, runId, mode: state.mode, url: state.url, stories: state.stories, probe: probe.id, work: path.relative(root, work) }));
