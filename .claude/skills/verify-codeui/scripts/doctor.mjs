#!/usr/bin/env node
// Read-only health check for a run started by launch.mjs.
// Usage: node doctor.mjs [--run <runId>]   (default: newest run in this worktree)
import { execFileSync } from "node:child_process";
import { stat } from "node:fs/promises";
import path from "node:path";
import { alive, buildMtime, loadRun, newestMtime, root, sourceMtime, storyIndex } from "./lib.mjs";

const run = await loadRun();
const checks = {};
const sh = (cmd, args) => { try { return execFileSync(cmd, args, { encoding: "utf8" }).trim(); } catch { return ""; } };

checks.processAlive = alive(run.pid);
const listeners = sh("lsof", ["-nP", `-iTCP:${run.port}`, "-sTCP:LISTEN", "-t"]).split("\n").filter(Boolean);
const groups = listeners.map(pid => Number(sh("ps", ["-o", "pgid=", "-p", pid])));
checks.portOwnedByRun = listeners.length > 0 && groups.every(g => g === run.pid);
let entries = [];
try { entries = await storyIndex(run.url); } catch (e) { checks.indexError = e.message; }
checks.indexReachable = entries.length > 0;
checks.storyCount = entries.filter(e => e.type === "story").length;
checks.docsCount = entries.filter(e => e.type === "docs").length;
if (run.mode === "static") checks.buildFresh = (await buildMtime()) >= (await sourceMtime());

// Informational: the packed kit (dist) is a different surface; Storybook resolves kit source.
const dist = (await stat(path.join(root, "packages/kit/dist/esm/index.js")).catch(() => null))?.mtimeMs ?? 0;
const kitSrc = await newestMtime(path.join(root, "packages/kit/src"));
const info = { kitDist: dist ? (dist >= kitSrc ? "fresh" : "stale") : "missing" };

const required = ["processAlive", "portOwnedByRun", "indexReachable"].concat(run.mode === "static" ? ["buildFresh"] : []);
const ok = required.every(k => checks[k]) && checks.storyCount > 0;
console.log(JSON.stringify({ ok, runId: run.runId, mode: run.mode, url: run.url, pid: run.pid, checks, info }, null, 2));
process.exitCode = ok ? 0 : 1;
