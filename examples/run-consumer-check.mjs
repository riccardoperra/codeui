import { checkHydration } from "./check-hydration.mjs";
import { spawnSync } from "node:child_process";
import {
	cpSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	writeFileSync,
	rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createServer } from "node:http";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scratch = mkdtempSync(join(tmpdir(), "kit-consumer-"));
const port = 6126;
const keep = process.argv.includes("--keep");
let failed = false;
function report(name, ok, reason) {
	console.log(`${ok ? "PASS" : "FAIL"} ${name}: ${reason}`);
	if (!ok) failed = true;
}
function run(command, args, cwd = root) {
	const result = spawnSync(command, args, {
		cwd,
		encoding: "utf8",
		maxBuffer: 20 * 1024 * 1024,
	});
	const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
	if (result.status !== 0) throw new Error(output || String(result.error));
	return output;
}
let server;
let browser;
let cssServer;
try {
	run("pnpm", ["run", "build:kit"]);
	const tarballs = {};
	for (const name of ["inkstone", "styles", "kit"]) {
		run("pnpm", ["--dir", `packages/${name}`, "pack", "--pack-destination", scratch]);
		tarballs[name] = join(
			scratch,
			readdirSync(scratch).find(
				file => file.startsWith(`codeui-${name}-`) && file.endsWith(".tgz"),
			),
		);
	}
	const inkstone = join(scratch, "inkstone");
	mkdirSync(inkstone);
	writeFileSync(
		join(inkstone, "package.json"),
		JSON.stringify({
			private: true,
			dependencies: { "@codeui/inkstone": `file:${tarballs.inkstone}` },
		}),
	);
	run("npm", ["install", "--no-audit", "--no-fund"], inkstone);
	run(
		"node",
		[
			"--input-type=module",
			"-e",
			`
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tokens, themeValues, breakpoints } from "@codeui/inkstone";
const require = createRequire(import.meta.url);
assert.deepEqual(require("@codeui/inkstone"), { tokens, themeValues, breakpoints });
assert.equal(tokens.action.brand.base, "var(--cui-action-brand-base)");
assert.equal(require("@codeui/inkstone/light.json").breakpoint.md.$value.value, breakpoints.md);
assert.match(readFileSync(require.resolve("@codeui/inkstone/theme.css"), "utf8"), /--cui-action-brand-base:/);
assert.equal(require("@codeui/inkstone/package.json").dependencies, undefined);
`,
		],
		inkstone,
	);
	report(
		"Inkstone standalone",
		true,
		"packed theme, resolved data, and ESM/CJS with no runtime dependencies",
	);

	const fixtures = {};
	for (const name of ["vite", "ssr", "css"]) {
		const cwd = join(scratch, name);
		cpSync(join(root, "examples", `consumer-${name}`), cwd, { recursive: true });
		const manifest = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
		if (name !== "css") manifest.dependencies["@codeui/kit"] = `file:${tarballs.kit}`;
		manifest.dependencies["@codeui/styles"] = `file:${tarballs.styles}`;
		manifest.dependencies["@codeui/inkstone"] = `file:${tarballs.inkstone}`;
		writeFileSync(join(cwd, "package.json"), JSON.stringify(manifest, null, 2));
		run("npm", ["install", "--no-audit", "--no-fund"], cwd);

		try {
			if (name !== "css") run("npm", ["run", "build"], cwd);
			report(`${name} build`, true, "packed kit installed and compiled");
			fixtures[name] = { cwd };
		} catch (error) {
			report(`${name} build`, false, error.message);
			fixtures[name] = { cwd, error: error.message };
		}
	}
	try {
		if (fixtures.ssr.error) throw new Error("blocked by SSR build failure above");
		const html = run("node", ["dist/entry.mjs"], fixtures.ssr.cwd);
		const markers = [
			'data-cui="button"',
			'data-cui="textfield-input"',
			'data-cui="select-trigger"',
			'data-cui="segmentedcontrol"',
			"Dialog body",
			"Popover body",
		];
		const missing = markers.filter(marker => !html.includes(marker));
		if (!fixtures.vite.error) {
			const index = join(fixtures.vite.cwd, "dist/index.html");
			const page = readFileSync(index, "utf8").replace(
				'<div id="app"></div>',
				`<div id="app">${html}</div>`,
			);
			writeFileSync(join(fixtures.vite.cwd, "dist/ssr.html"), page);
		}
		report(
			"SSR markup",
			!missing.length,
			missing.length ? `missing ${missing.join(", ")}` : "all six components present",
		);
	} catch (error) {
		report("SSR markup", false, error.message);
	}
	const client = fixtures.vite;
	const assertions = [
		"page renders without errors",
		"Button background",
		"plain CSS token override",
	];
	if (client.error) {
		for (const assertion of assertions)
			report(assertion, false, "blocked by Vite build failure above");
	} else {
		try {
			const { chromium } = await import(
				pathToFileURL(join(client.cwd, "node_modules/playwright/index.mjs"))
			);
			if (!existsSync(chromium.executablePath()))
				run("npx", ["playwright", "install", "chromium", "--no-shell"], client.cwd);
			const { preview } = await import(
				pathToFileURL(join(client.cwd, "node_modules/vite/dist/node/index.js"))
			);
			server = await preview({
				root: client.cwd,
				configFile: false,
				preview: { host: "127.0.0.1", port, strictPort: true },
			});
			browser = await chromium.launch({ headless: true, channel: "chromium" });
			if (!fixtures.css.error) {
				const cssRoot = fixtures.css.cwd;
				cssServer = createServer((request, response) => {
					const requested = new URL(request.url, "http://localhost").pathname;
					const file = resolve(
						cssRoot,
						"." + (requested === "/" ? "/index.html" : decodeURIComponent(requested)),
					);
					if (!file.startsWith(cssRoot + "/") || !existsSync(file)) {
						response.writeHead(404).end();
						return;
					}
					response.setHeader(
						"Content-Type",
						file.endsWith(".css") ? "text/css" : "text/html",
					);
					response.end(readFileSync(file));
				});
				await new Promise(resolve => cssServer.listen(0, "127.0.0.1", resolve));
				const context = await browser.newContext({ javaScriptEnabled: false });
				const cssPage = await context.newPage();
				const scripts = [];
				cssPage.on("request", request => {
					if (request.resourceType() === "script") scripts.push(request.url());
				});
				await cssPage.goto(`http://127.0.0.1:${cssServer.address().port}`, {
					waitUntil: "networkidle",
				});
				const colors = await cssPage
					.locator("button")
					.first()
					.evaluate(element => {
						const token = getComputedStyle(document.documentElement).getPropertyValue(
							"--cui-action-brand-base",
						);
						const probe = document.createElement("span");
						probe.style.backgroundColor = "var(--cui-action-brand-base)";
						document.body.append(probe);
						const expected = getComputedStyle(probe).backgroundColor;
						probe.remove();
						return { actual: getComputedStyle(element).backgroundColor, expected, token };
					});
				report(
					"CSS-only native button",
					colors.token.trim().length > 0 && colors.actual === colors.expected,
					`${JSON.stringify(colors)} with JavaScript disabled`,
				);
				const buttonStyles = await cssPage.locator("button").evaluateAll(buttons =>
					buttons.map(button => {
						const style = getComputedStyle(button);
						return [
							style.height,
							style.backgroundColor,
							style.color,
							style.padding,
							style.borderRadius,
							style.fontSize,
						];
					}),
				);
				report(
					"CSS-only Button data attributes",
					buttonStyles.length === 2 &&
						buttonStyles[0][0] === "44px" &&
						buttonStyles[1][0] === "36px" &&
						buttonStyles[0][1] === buttonStyles[1][1],
					JSON.stringify(buttonStyles),
				);
				report(
					"CSS-only dependency boundary",
					!existsSync(join(cssRoot, "node_modules/solid-js")) &&
						!existsSync(join(cssRoot, "node_modules/@solidjs/web")) &&
						!scripts.length,
					"styles installed without Solid and no scripts requested",
				);
				const classes = JSON.parse(
					run(
						"node",
						[
							"--input-type=module",
							"-e",
							`
import { button } from '@codeui/styles/button';
import { iconButton } from '@codeui/styles/iconbutton';
import { label } from '@codeui/styles/fieldlabel';
import { switchStyles } from '@codeui/styles/switch';
console.log(JSON.stringify({ button: button() + ' ' + iconButton, label: label + ' ' + switchStyles.label() }));
`,
						],
						cssRoot,
					),
				);
				const cssFiles = ["button", "iconbutton", "fieldlabel", "switch"];
				const themeCss = readFileSync(
					join(cssRoot, "node_modules/@codeui/styles/dist/theme.css"),
					"utf8",
				);
				let expectedComposition;
				for (const order of [
					cssFiles,
					[...cssFiles].reverse(),
					[...cssFiles, ...cssFiles],
				]) {
					const css = order
						.map(name =>
							readFileSync(
								join(cssRoot, `node_modules/@codeui/styles/dist/${name}.css`),
								"utf8",
							),
						)
						.join("\n");
					await cssPage.setContent(
						`<html data-cui-theme="dark"><head><style>${themeCss}</style><style>${css}</style></head><body><label id="label" class="${classes.label}">Name</label><button id="icon" class="${classes.button}" data-size="md" data-variant="primary">+</button></body></html>`,
					);
					const composition = await cssPage.evaluate(() => {
						const label = getComputedStyle(document.querySelector("#label"));
						const button = getComputedStyle(document.querySelector("#icon"));
						return {
							lineHeight: label.lineHeight,
							padding: button.padding,
							width: button.width,
							height: button.height,
						};
					});
					if (expectedComposition === undefined)
						expectedComposition = JSON.stringify(composition);
					report(
						"CSS composition order",
						JSON.stringify(composition) === expectedComposition &&
							composition.padding === "0px",
						JSON.stringify({ order, ...composition }),
					);
				}
				const inkstoneCss = readFileSync(
					join(inkstone, "node_modules/@codeui/inkstone/dist/theme.css"),
					"utf8",
				);
				await cssPage.setContent(`
					<style>${inkstoneCss}
						article { background: var(--cui-surface-panel); color: var(--cui-action-brand-base) }
					</style>
					<article data-cui-theme="light">Light</article>
					<article data-cui-theme="dark" style="--cui-action-brand-base: #112233">Dark</article>
				`);
				const scopes = await cssPage.locator("article").evaluateAll(elements =>
					elements.map(element => {
						const style = getComputedStyle(element);
						return { background: style.backgroundColor, color: style.color };
					}),
				);
				report(
					"Inkstone standalone CSS",
					scopes.length === 2 &&
						scopes[0].background !== scopes[1].background &&
						scopes[0].color === "rgb(0, 118, 207)" &&
						scopes[1].color === "rgb(17, 34, 51)",
					JSON.stringify(scopes),
				);
				await context.close();
			}
			const page = await browser.newPage();
			const errors = [];
			page.on("pageerror", error => errors.push(error.message));
			page.on("console", message => {
				if (message.type() === "error") errors.push(message.text());
			});
			await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "networkidle" });
			const parts = [
				"button",
				"textfield-input",
				"select-trigger",
				"dialog-panel",
				"popover-content",
				"segmentedcontrol",
			];
			const missing = [];
			for (const part of parts)
				if (!(await page.locator(`[data-cui="${part}"]`).count())) missing.push(part);
			report(
				assertions[0],
				!errors.length && !missing.length,
				JSON.stringify({ errors, missing }),
			);
			const button = page.locator("#consumer-button");
			if (!(await button.count())) {
				report(assertions[1], false, "Button absent after page load");
				report(assertions[2], false, "Button absent after page load");
			} else {
				const expected = await page.evaluate(() => {
					const probe = document.createElement("span");
					probe.style.backgroundColor = "var(--cui-action-brand-base)";
					document.body.append(probe);
					const color = getComputedStyle(probe).backgroundColor;
					probe.remove();
					return color;
				});
				const before = await button.evaluate(el => getComputedStyle(el).backgroundColor);
				report(
					assertions[1],
					before === expected && expected !== "rgba(0, 0, 0, 0)",
					`computed ${before}; theme brand ${expected}`,
				);
				await page.addStyleTag({
					content: "[data-cui-theme] { --cui-action-brand-base: rgb(17, 34, 51); }",
				});
				await page
					.waitForFunction(
						() =>
							getComputedStyle(document.querySelector("#consumer-button"))
								.backgroundColor === "rgb(17, 34, 51)",
						undefined,
						{ timeout: 2000 },
					)
					.catch(() => {});
				const after = await button.evaluate(el => getComputedStyle(el).backgroundColor);
				report(
					assertions[2],
					after === "rgb(17, 34, 51)" && after !== before,
					`${before} -> ${after}`,
				);
			}
			try {
				const hydratedPage = await browser.newPage();
				const result = await checkHydration(
					hydratedPage,
					`http://127.0.0.1:${port}/ssr.html`,
				);
				report(
					"SSR hydration",
					result.adoption && !result.errors.length,
					JSON.stringify(result),
				);
				await hydratedPage.close();
			} catch (error) {
				report("SSR hydration", false, error.message);
			}
		} catch (error) {
			for (const assertion of assertions) report(assertion, false, error.message);
		}
	}
} catch (error) {
	report("consumer check infrastructure", false, error.stack);
} finally {
	await browser?.close();
	if (server) await new Promise(resolve => server.httpServer.close(resolve));
	if (cssServer) await new Promise(resolve => cssServer.close(resolve));
	if (keep) console.log(`Consumer artifacts: ${scratch}`);
	else rmSync(scratch, { recursive: true, force: true });
}
process.exitCode = failed ? 1 : 0;
