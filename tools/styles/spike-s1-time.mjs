import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { performance } from "node:perf_hooks";
import path from "node:path";

const reference = process.argv[2];
if (!reference)
	throw new Error(
		"Usage: node tools/styles/spike-s1-time.mjs <pilot-styles-package-directory>",
	);
// Both builds clear their dist directories. Run with no other build in progress.
const times = { pilot: [], plain: [] };
for (let run = 0; run < 5; run++) {
	for (const [kind, cwd] of [
		["pilot", reference],
		["plain", "packages/styles"],
	]) {
		const start = performance.now();
		const result = spawnSync(process.execPath, ["scripts/build.mjs"], {
			cwd,
			encoding: "utf8",
		});
		if (result.status !== 0) throw new Error(result.stderr + result.stdout);
		times[kind].push((performance.now() - start) / 1000);
	}
}
const output = path.resolve(".artifacts/styles-spike-s1");
await mkdir(output, { recursive: true });
await writeFile(
	path.join(output, "build-times.json"),
	JSON.stringify(times, null, 2) + "\n",
);
console.log(JSON.stringify(times));
