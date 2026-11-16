import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
export const work = path.join(root, ".verify-codeui");
export const runsDir = path.join(work, "runs");
export const evidenceDir = path.join(work, "evidence");
export const staticDir = path.join(work, "storybook-static");
export const sourceDirs = ["packages/kit/src", "packages/storybook/src", "packages/storybook/.storybook"];

export async function ensureWork() {
	await mkdir(runsDir, { recursive: true });
	await mkdir(evidenceDir, { recursive: true });
	await writeFile(path.join(work, ".gitignore"), "*\n");
}

export function flag(name, fallback) {
	const i = process.argv.indexOf(`--${name}`);
	if (i === -1) return fallback;
	const next = process.argv[i + 1];
	return next === undefined || next.startsWith("--") ? true : next;
}

export async function loadRun(id = flag("run")) {
	const files = (await readdir(runsDir).catch(() => [])).filter(f => f.endsWith(".json")).sort();
	const file = id ? `${id}.json` : files.at(-1);
	if (!file || !files.includes(file)) throw Error(`No run ${id ?? ""} in ${runsDir}. Run launch.mjs first.`);
	return JSON.parse(await readFile(path.join(runsDir, file), "utf8"));
}

export async function newestMtime(dir) {
	let newest = 0;
	for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
		if (entry.name === "node_modules") continue;
		const full = path.join(dir, entry.name);
		newest = Math.max(newest, entry.isDirectory() ? await newestMtime(full) : (await stat(full)).mtimeMs);
	}
	return newest;
}

export const sourceMtime = async () =>
	Math.max(...(await Promise.all(sourceDirs.map(d => newestMtime(path.join(root, d))))));

export const buildMtime = async () =>
	(await stat(path.join(staticDir, "index.json")).catch(() => null))?.mtimeMs ?? 0;

/** tools/baseline/browser.mjs reads BASELINE_URL at import time. */
export async function baseline(url) {
	process.env.BASELINE_URL = url;
	return import(path.join(root, "tools/baseline/browser.mjs"));
}

export async function storyIndex(url) {
	const res = await fetch(`${url}/index.json`);
	if (!res.ok) throw Error(`index.json HTTP ${res.status}`);
	return Object.values((await res.json()).entries);
}

export function alive(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch {
		return false;
	}
}
