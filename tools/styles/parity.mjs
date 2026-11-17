import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const [fixture, output, reference] = process.argv
	.slice(2)
	.map(value => path.resolve(value));
if (!fixture || !output)
	throw new Error(
		"Usage: node tools/styles/parity.mjs <built-fixture> <output> [reference]",
	);
const { preview } = await import(
	pathToFileURL(path.join(fixture, "node_modules/vite/dist/node/index.js"))
);
const playwright =
	process.env.CODEUI_PLAYWRIGHT ??
	path.join(fixture, "node_modules/playwright/index.mjs");
const browserTypes = await import(pathToFileURL(playwright));
const browserName = process.env.CODEUI_BROWSER ?? "chromium";
assert(
	["chromium", "firefox", "webkit"].includes(browserName),
	"Supported browser engine",
);
const server = await preview({
	root: fixture,
	configFile: false,
	preview: { host: "127.0.0.1", port: 0 },
});
const browser = await browserTypes[browserName].launch({
	headless: true,
	args:
		browserName === "chromium"
			? [
					"--disable-gpu",
					"--disable-skia-runtime-opts",
					"--run-all-compositor-stages-before-draw",
					"--disable-partial-raster",
				]
			: undefined,
});
await mkdir(output, { recursive: true });
const sizes = [
	[1440, 900],
	[1024, 768],
	[390, 844],
];
const properties = [
	"display",
	"position",
	"width",
	"height",
	"padding",
	"margin",
	"gap",
	"font-family",
	"font-size",
	"font-weight",
	"line-height",
	"color",
	"background-color",
	"border",
	"border-radius",
	"box-shadow",
	"outline",
	"transform",
	"opacity",
];
const results = [];
try {
	for (const theme of ["light", "dark"])
		for (const [width, height] of sizes) {
			const page = await browser.newPage({
				viewport: { width, height },
				reducedMotion: "reduce",
				colorScheme: theme,
			});
			const errors = [];
			page.on("pageerror", error => errors.push(error.message));
			await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`, {
				waitUntil: "networkidle",
			});
			await page.evaluate(mode => {
				document.documentElement.setAttribute("data-cui-theme", mode);
				document
					.querySelector("main[data-cui-theme]")
					?.setAttribute("data-cui-theme", mode);
			}, theme);
			await page.addStyleTag({
				content:
					"*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}",
			});
			if (process.env.CODEUI_PARITY_MUTATION === "1")
				await page.addStyleTag({ content: "button{opacity:0.5!important}" });
			await page.evaluate(() => document.fonts.ready);
			assert.deepEqual(errors, [], "consumer renders without browser errors");
			for (const state of ["off", "on"]) {
				if (state === "on") {
					const control = page.getByRole("switch", { name: "Consumer switch" });
					await control.focus();
					await page.keyboard.press("Space");
					assert.equal(await control.isChecked(), true, "keyboard toggles switch");
				}
				const values = await page.evaluate(props => {
					const read = (element, pseudo) => {
						const style = getComputedStyle(element, pseudo);
						return Object.fromEntries(
							props.map(name => [name, style.getPropertyValue(name)]),
						);
					};
					return [...document.querySelectorAll("[data-cui]")].map(element => ({
						part: element.getAttribute("data-cui"),
						style: read(element),
						before: read(element, "::before"),
						after: read(element, "::after"),
					}));
				}, properties);
				assert(values.length > 10, "parity capture contains rendered component parts");
				const id = `${theme}-${width}-${state}`;
				await writeFile(
					path.join(output, `${id}.json`),
					JSON.stringify(values, null, 2) + "\n",
				);
				const png = await page.screenshot({
					path: path.join(output, `${id}.png`),
					fullPage: true,
				});
				if (reference) {
					assert.deepEqual(
						values,
						JSON.parse(await readFile(path.join(reference, `${id}.json`), "utf8")),
						`${id} computed styles match`,
					);
					assert.equal(
						createHash("sha256").update(png).digest("hex"),
						createHash("sha256")
							.update(await readFile(path.join(reference, `${id}.png`)))
							.digest("hex"),
						`${id} screenshot matches`,
					);
				}
				results.push({ id, parts: values.length, screenshot: `${id}.png` });
			}
			await page.close();
		}
	await writeFile(
		path.join(output, "results.json"),
		JSON.stringify(results, null, 2) + "\n",
	);
	console.log(
		`PASS ${results.length} theme/viewport/state captures${reference ? ", exact computed-style and screenshot parity" : ""}`,
	);
} finally {
	await browser.close();
	await new Promise(resolve => server.httpServer.close(resolve));
}
