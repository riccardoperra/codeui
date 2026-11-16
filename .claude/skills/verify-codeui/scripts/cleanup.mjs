#!/usr/bin/env node
// Stop servers this worktree's runs started. Never touches .verify-codeui/evidence/.
// Usage: node cleanup.mjs [--run <runId> | --all] [--purge-build]
import { execFileSync } from "node:child_process";
import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { alive, evidenceDir, flag, loadRun, root, runsDir, staticDir } from "./lib.mjs";

const runs = flag("all", false) === true
	? await Promise.all((await readdir(runsDir).catch(() => [])).filter(f => f.endsWith(".json")).map(f => loadRun(f.slice(0, -5))))
	: [await loadRun().catch(() => null)].filter(Boolean);
const report = [];
for (const run of runs) {
	// launch.mjs spawns detached, so run.pid is the process-group id of everything it started.
	const signal = sig => { try { process.kill(-run.pid, sig); } catch {} };
	if (alive(run.pid)) {
		signal("SIGTERM");
		for (let i = 0; i < 20 && alive(run.pid); i++) await new Promise(r => setTimeout(r, 250));
		signal("SIGKILL");
	}
	let listening = "";
	if (run.port) try { listening = execFileSync("lsof", ["-nP", `-iTCP:${run.port}`, "-sTCP:LISTEN", "-t"], { encoding: "utf8" }).trim(); } catch {}
	await rm(path.join(runsDir, `${run.runId}.json`), { force: true });
	await rm(path.join(runsDir, `${run.runId}.log`), { force: true });
	report.push({ runId: run.runId, stopped: !alive(run.pid), portFree: !listening });
}
if (flag("purge-build", false) === true) await rm(staticDir, { recursive: true, force: true });
const evidence = (await readdir(evidenceDir).catch(() => [])).length;
console.log(JSON.stringify({ cleaned: report, evidenceKept: path.relative(root, evidenceDir), evidenceFolders: evidence }, null, 2));
process.exitCode = report.every(r => r.stopped && r.portFree) ? 0 : 1;
