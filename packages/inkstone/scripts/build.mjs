import { execFileSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { generateTheme } from "./tokens.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const out = path.join(root, "dist");
const { css, media, resolved } = await generateTheme(root);
const layerOrder = await readFile(path.join(root, "css/layers.css"), "utf8");
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await Promise.all([
	writeFile(path.join(out, "layers.css"), layerOrder),
	writeFile(path.join(out, "theme.css"), layerOrder + css),
	writeFile(path.join(out, "custom-media.css"), media + "\n"),
	...Object.entries(resolved).map(([mode, values]) =>
		writeFile(path.join(out, `${mode}.json`), JSON.stringify(values, null, 2) + "\n"),
	),
]);
for (const format of ["esm", "cjs"])
	await build({
		absWorkingDir: root,
		entryPoints: ["src/index.ts", "src/derived.ts"],
		outdir: path.join(out, format),
		format,
		platform: "neutral",
		bundle: true,
		splitting: format === "esm",
		minify: true,
		outExtension: { ".js": format === "esm" ? ".js" : ".cjs" },
	});
execFileSync(
	process.execPath,
	[require.resolve("typescript/bin/tsc"), "-p", "tsconfig.json"],
	{
		cwd: root,
		stdio: "inherit",
	},
);
const types = path.join(out, "types");
const typesCjs = path.join(out, "types-cjs");
await mkdir(typesCjs, { recursive: true });
for (const file of await readdir(types)) {
	const declaration = await readFile(path.join(types, file), "utf8");
	await writeFile(
		path.join(typesCjs, file.replace(/\.d\.ts$/, ".d.cts")),
		declaration.replace(/(from ["']\.\/[^"']+)\.js(["'])/g, "$1.cjs$2"),
	);
}
