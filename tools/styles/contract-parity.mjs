import { chromium } from "playwright";
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const dir = fileURLToPath(
	new URL("../../.artifacts/styles-pilot-parity/", import.meta.url),
);
await mkdir(dir, { recursive: true });
await writeFile(
	dir + "contract.css",
	await readFile(new URL("../../packages/styles/dist/all.css", import.meta.url), "utf8"),
);
const browser = await chromium.launch({ headless: true });
await mkdir(dir + "screenshots", { recursive: true });
const reset = await readFile(
	new URL("../../packages/storybook/.storybook/reset.css", import.meta.url),
	"utf8",
);
await writeFile(dir + "reset.css", reset);
const rows = [];
const samples = [];
for (const [component, story, selector] of [
	["button", "primary", '[data-cui="button"]'],
	["iconbutton", "primary", '[data-cui="icon-button"]'],
	["switch", "states", '[data-cui="switch-root"]'],
	["dialog", "sizes", '[data-cui="dialog-positioner"]'],
]) {
	for (const theme of ["dark", "light"]) {
		const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
		const errors = [];
		page.on("pageerror", e => errors.push(e.message));
		await page.goto(
			`http://localhost:6006/iframe.html?id=designsystem-${component}--${story}&viewMode=story`,
		);
		await page.locator("[data-cui]").first().waitFor();
		await page.evaluate(theme => {
			window.__STORYBOOK_ADDONS_CHANNEL__.emit("DARK_MODE", theme === "dark");
			document.documentElement.dataset.cuiTheme = theme;
		}, theme);
		await page.addStyleTag({
			content:
				"*,*::before,*::after{animation:none!important;transition:none!important} html,body{font-family:Arial!important}",
		});
		if (component === "dialog")
			await page.getByRole("button", { name: "Open (md)", exact: true }).click();
		const target = page.locator(selector).first();
		await target.waitFor();
		await (component === "dialog" ? page : target).screenshot({
			path: `${dir}screenshots/storybook-${component}-${theme}.png`,
		});
		if (component === "switch")
			await page
				.locator('[data-cui="switch-control"]')
				.first()
				.screenshot({ path: dir + "screenshots/storybook-track-" + theme + ".png" });
		const beforeDetails = await page
			.locator('[data-cui="dialog-panel"], [data-cui="switch-control"]')
			.evaluateAll(es =>
				es.map(e => {
					const r = e.getBoundingClientRect();
					return {
						part: e.dataset.cui,
						width: r.width,
						height: r.height,
						background: getComputedStyle(e).backgroundColor,
					};
				}),
			);
		const panelBefore =
			component === "dialog"
				? await page
						.locator('[data-cui="dialog-panel"]')
						.screenshot({ path: `${dir}screenshots/storybook-panel-${theme}.png` })
				: null;
		const before = await target.evaluate(e => {
			const s = getComputedStyle(e),
				r = e.getBoundingClientRect();
			return {
				width: r.width,
				height: r.height,
				background: s.backgroundColor,
				color: s.color,
				padding: s.padding,
				borderRadius: s.borderRadius,
			};
		});
		let markup = await target.evaluate(e => {
			const copy = e.cloneNode(true);
			for (const n of [copy, ...copy.querySelectorAll("*")]) {
				const part = n.getAttribute("data-cui");
				if (part === "dialog-panel")
					n.setAttribute("data-size", e.getAttribute("data-panel-size"));
				n.removeAttribute("class");
				if (part) n.className = "cui-" + part;
			}
			return copy.outerHTML;
		});
		if (component === "switch")
			markup = await page.locator('[data-cui="switch-root"]').evaluateAll(
				es =>
					'<div style="display:grid;gap:16px">' +
					es
						.map(e => {
							const c = e.cloneNode(true);
							for (const n of [c, ...c.querySelectorAll("*")]) {
								n.removeAttribute("class");
								if (n.dataset.cui) n.className = "cui-" + n.dataset.cui;
							}
							return c.outerHTML;
						})
						.join("") +
					"</div>",
			);
		const html = `<!doctype html><html data-cui-theme="${theme}" data-cui-input="keyboard"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="stylesheet" href="reset.css"><link rel="stylesheet" href="contract.css"><style>html,body{font-family:Arial;background:var(--cui-surface-canvas);color:var(--cui-text-default)} body{padding:32px} *,*::before,*::after{animation:none!important;transition:none!important}</style><body>${markup}</body></html>`;
		const file = `${component}-${theme}.html`;
		await writeFile(dir + file, html);
		samples.push({ component, theme, file });
		await page.goto("file://" + dir + file);
		const plain = page.locator(selector).first();
		await (component === "dialog" ? page : plain).screenshot({
			path: `${dir}screenshots/contract-${component}-${theme}.png`,
		});
		const after = await plain.evaluate(e => {
			const s = getComputedStyle(e),
				r = e.getBoundingClientRect();
			return {
				width: r.width,
				height: r.height,
				background: s.backgroundColor,
				color: s.color,
				padding: s.padding,
				borderRadius: s.borderRadius,
			};
		});
		if (component === "switch")
			await page
				.locator('[data-cui="switch-control"]')
				.first()
				.screenshot({ path: dir + "screenshots/contract-track-" + theme + ".png" });
		const details = await page
			.locator('[data-cui="dialog-panel"], [data-cui="switch-control"]')
			.evaluateAll(es =>
				es.map(e => {
					const r = e.getBoundingClientRect();
					return {
						part: e.dataset.cui,
						width: r.width,
						height: r.height,
						background: getComputedStyle(e).backgroundColor,
					};
				}),
			);
		const panelPixelsEqual = panelBefore
			? panelBefore.equals(
					await page
						.locator('[data-cui="dialog-panel"]')
						.screenshot({ path: `${dir}screenshots/contract-panel-${theme}.png` }),
				)
			: null;
		if (JSON.stringify(beforeDetails) !== JSON.stringify(details))
			throw new Error("Part geometry/color mismatch: " + component + " " + theme);
		if (component !== "switch" && JSON.stringify(before) !== JSON.stringify(after))
			throw new Error("Computed style mismatch: " + component + " " + theme);
		rows.push({
			component,
			theme,
			before,
			after,
			beforeDetails,
			details,
			panelPixelsEqual,
			errors,
		});
		await page.close();
	}
}
await writeFile(dir + "comparison.json", JSON.stringify(rows, null, 2));
await writeFile(
	dir + "index.html",
	'<!doctype html><meta charset="utf-8"><title>CSS contract proof</title><h1>Plain HTML contract proof</h1>' +
		samples
			.map(
				s =>
					`<h2>${s.component} · ${s.theme}</h2><iframe title="${s.component} ${s.theme}" src="${s.file}" style="width:100%;height:${s.component === "dialog" ? 600 : 160}px;border:0"></iframe>`,
			)
			.join(""),
);
for (const { component, theme, file } of samples)
	for (const [width, height] of [
		[1024, 768],
		[390, 844],
	]) {
		const p = await browser.newPage({ viewport: { width, height } });
		await p.goto("file://" + dir + file);
		await p.screenshot({
			path: `${dir}screenshots/contract-${component}-${theme}-${width}.png`,
		});
		await p.close();
	}
await browser.close();
console.log(JSON.stringify(rows, null, 2));
