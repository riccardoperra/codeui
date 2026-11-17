import assert from "node:assert/strict";
import { createRequire } from "node:module";
import {
	mkdir,
	mkdtemp,
	readFile,
	readdir,
	rm,
	symlink,
	writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { build } from "vite";

const require = createRequire(import.meta.url);
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
if (!process.argv[2])
	throw new Error(
		"Usage: node tools/styles/bundle-check.mjs <installed-css-consumer> [report.json]",
	);
const consumer = path.resolve(process.argv[2]);
const scratch = await mkdtemp(path.join(tmpdir(), "codeui-bundles-"));
const report = [];
try {
	await symlink(
		path.join(consumer, "node_modules"),
		path.join(scratch, "node_modules"),
		"dir",
	);
	await writeFile(path.join(scratch, "package.json"), '{"type":"module"}');
	await writeFile(
		path.join(scratch, "dialog.js"),
		'import "@codeui/styles/dialog.css"; export const open = () => "dialog";',
	);
	const scenarios = {
		unused:
			'import {button} from "@codeui/styles/button"; document.body.textContent="No component";',
		button:
			'import "@codeui/styles/theme.css"; import "@codeui/styles/button.css"; import {button} from "@codeui/styles/button"; document.body.className=button({theme:"primary"});',
		lazy: 'import "@codeui/styles/theme.css"; import "@codeui/styles/button.css"; window.openDialog=()=>import("./dialog.js").then(module=>module.open());',
	};
	for (const [scenario, source] of Object.entries(scenarios)) {
		const entry = path.join(scratch, "main.js");
		await writeFile(entry, source);
		for (const bundler of ["vite", "webpack"]) {
			const dist = path.join(scratch, scenario, bundler);
			await mkdir(dist, { recursive: true });
			if (bundler === "vite")
				await build({
					root: scratch,
					configFile: false,
					logLevel: "silent",
					build: { outDir: dist, cssCodeSplit: true, rollupOptions: { input: entry } },
				});
			else
				await new Promise((resolve, reject) => {
					const compiler = webpack({
						mode: "production",
						context: scratch,
						entry,
						output: { path: dist, filename: "main.js" },
						module: {
							rules: [
								{
									test: /\.css$/,
									use: [MiniCssExtractPlugin.loader, require.resolve("css-loader")],
								},
							],
						},
						plugins: [new MiniCssExtractPlugin({ filename: "[name].css" })],
					});
					compiler.run((error, stats) =>
						compiler.close(closeError =>
							error || closeError || stats.hasErrors()
								? reject(
										error ||
											closeError ||
											new Error(stats.toString({ all: false, errors: true })),
									)
								: resolve(),
						),
					);
				});
			const cssFiles = (await readdir(dist, { recursive: true })).filter(file =>
				file.endsWith(".css"),
			);
			const assets = await Promise.all(
				cssFiles.map(async file => ({
					file,
					css: await readFile(path.join(dist, file), "utf8"),
				})),
			);
			const css = assets.map(asset => asset.css).join("\n");
			assert.equal(
				/\.cui-button-/.test(css),
				scenario !== "unused",
				`${bundler} ${scenario} retains only requested Button CSS`,
			);
			assert.equal(
				/\.cui-dialog-/.test(css),
				scenario === "lazy",
				`${bundler} ${scenario} selects Dialog only when imported`,
			);
			assert.equal(
				/\.cui-combobox-|\.cui-switch-/.test(css),
				false,
				`${bundler} ${scenario} excludes unrelated CSS`,
			);
			if (scenario === "unused")
				assert.equal(
					cssFiles.length,
					0,
					`${bundler} unused helper imports generate no CSS`,
				);
			if (scenario === "lazy") {
				const initial = assets.find(asset => /(?:^|\/)main(?:-|\.)/.test(asset.file));
				assert(initial, `${bundler} initial CSS asset exists`);
				assert(
					!/\.cui-dialog-/.test(initial.css),
					`${bundler} initial CSS excludes lazy Dialog`,
				);
				assert(
					assets.some(asset => asset !== initial && /\.cui-dialog-/.test(asset.css)),
					`${bundler} Dialog has a separate CSS chunk`,
				);
			}
			report.push({ bundler, scenario, cssFiles });
			console.log(`PASS ${bundler} ${scenario}`);
		}
	}
	if (process.argv[3])
		await writeFile(
			path.resolve(process.argv[3]),
			JSON.stringify(report, null, 2) + "\n",
		);
} finally {
	await rm(scratch, { recursive: true, force: true });
}
