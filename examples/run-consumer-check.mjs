import { spawnSync } from "node:child_process";
import {
	cpSync,
	existsSync,
	mkdtempSync,
	readdirSync,
	readFileSync,
	writeFileSync,
	rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scratch = mkdtempSync(join(tmpdir(), "kit-consumer-"));
const workaround = process.argv.includes("--with-vanilla-extract");
const port = workaround ? 6127 : 6126;
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
try {
	run("pnpm", ["run", "build:kit"]);
	run("pnpm", ["--dir", "packages/kit", "pack", "--pack-destination", scratch]);
	const tarball = join(
		scratch,
		readdirSync(scratch).find(name => name.endsWith(".tgz")),
	);
	const fixtures = {};
	for (const name of ["vite", "ssr"]) {
		const cwd = join(scratch, name);
		cpSync(join(root, "examples", `consumer-${name}`), cwd, { recursive: true });
		const manifest = JSON.parse(readFileSync(join(cwd, "package.json"), "utf8"));
		manifest.dependencies["@codeui/kit"] = `file:${tarball}`;
		if (workaround) manifest.devDependencies["@vanilla-extract/vite-plugin"] = "4.0.15";
		writeFileSync(join(cwd, "package.json"), JSON.stringify(manifest, null, 2));
		run("npm", ["install", "--no-audit", "--no-fund"], cwd);
		if (workaround) {
			const config = join(cwd, "vite.config.js");
			writeFileSync(
				config,
				`import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';\n` +
					readFileSync(config, "utf8").replace(
						"plugins: [",
						"plugins: [vanillaExtractPlugin(), ",
					),
			);
		}
		try {
			run("npm", ["run", "build"], cwd);
			report(`${name} build`, true, "packed kit installed and compiled");
			fixtures[name] = { cwd };
		} catch (error) {
			report(`${name} build`, false, error.message);
			fixtures[name] = { cwd, error: error.message };
		}
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
			const page = await browser.newPage();
			const errors = [];
			page.on("pageerror", error => errors.push(error.message));
			page.on("console", message => {
				if (message.type() === "error") errors.push(message.text());
			});
			await page.goto(`http://127.0.0.1:${port}`, { waitUntil: "networkidle" });
			const parts = [
				"button",
				"text-field-input",
				"select-trigger",
				"dialog-panel",
				"popover-content",
				"segmentedControl",
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
				const before = await button.evaluate(el => getComputedStyle(el).backgroundColor);
				report(
					assertions[1],
					before === "rgb(0, 112, 240)",
					`computed ${before}; expected rgb(0, 112, 240)`,
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
		} catch (error) {
			for (const assertion of assertions) report(assertion, false, error.message);
		}
	}
	try {
		if (fixtures.ssr.error) throw new Error("blocked by SSR build failure above");
		const html = run("node", ["dist/entry.mjs"], fixtures.ssr.cwd);
		const markers = [
			'data-cui="button"',
			'data-cui="text-field-input"',
			'data-cui="select-trigger"',
			'data-cui="segmentedControl"',
			"Dialog body",
			"Popover body",
		];
		const missing = markers.filter(marker => !html.includes(marker));
		report(
			"SSR markup",
			!missing.length,
			missing.length ? `missing ${missing.join(", ")}` : "all six components present",
		);
	} catch (error) {
		report("SSR markup", false, error.message);
	}
} catch (error) {
	report("consumer check infrastructure", false, error.stack);
} finally {
	await browser?.close();
	if (server) await new Promise(resolve => server.httpServer.close(resolve));
	rmSync(scratch, { recursive: true, force: true });
}
process.exitCode = failed ? 1 : 0;
