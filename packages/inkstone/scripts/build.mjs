import { execFileSync } from "node:child_process";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "tsdown";
import { generateTokens, renderTheme } from "./tokens.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url);
const out = path.join(root, "dist");
const tokenData = await generateTokens(root);
const layerOrder = await readFile(path.join(root, "css/layers.css"), "utf8");
await rm(out, { recursive: true, force: true });
for (const format of ["esm", "cjs"])
	await build({
		cwd: root,
		config: false,
		entry: ["src/index.ts", "src/derived.ts"],
		outDir: path.join(out, format),
		format,
		platform: "neutral",
		target: "esnext",
		dts: false,
		clean: false,
		minify: true,
		report: false,
		outExtensions: () => ({ js: format === "esm" ? ".js" : ".cjs" }),
		outputOptions:
			format === "cjs" ? { esModule: true, generatedCode: { symbols: false } } : undefined,
	});
const derivations = await import(pathToFileURL(path.join(out, "esm/derived.js")).href);
const { css, media } = renderTheme(tokenData, derivations);
await Promise.all([
	writeFile(path.join(out, "layers.css"), layerOrder),
	writeFile(path.join(out, "theme.css"), layerOrder + css),
	writeFile(path.join(out, "custom-media.css"), media + "\n"),
	...Object.entries(tokenData.resolved).map(([mode, values]) =>
		writeFile(path.join(out, `${mode}.json`), JSON.stringify(values, null, 2) + "\n"),
	),
]);
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
