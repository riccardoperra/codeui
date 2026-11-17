import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";
import { button } from "../../packages/styles/dist/esm/button.js";
import { switchStyles } from "../../packages/styles/dist/esm/switch.js";
import { panel, dialogStyles } from "../../packages/styles/dist/esm/dialog.js";

const directory = new URL("../../.artifacts/styles-pilot/", import.meta.url);
await mkdir(directory, { recursive: true });
const css = Object.fromEntries(
	await Promise.all(
		["theme", "button", "icon-button", "dialog", "switch"].map(async name => [
			name,
			await readFile(
				new URL("../../packages/styles/dist/" + name + ".css", import.meta.url),
				"utf8",
			),
		]),
	),
);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let count = 0;
try {
	for (const theme of ["dark", "light"]) {
		const markup = `<button id="helper" class="${button({ size: "sm", theme: "primary" })}">Save</button>
<button id="default-helper" class="${button({ theme: "primary" })}">Save</button>
<button id="default-attribute" class="cui-button" data-size="md" data-theme="primary">Save</button>
<button id="attribute" class="cui-button" data-size="sm" data-theme="primary">Save</button>
<button id="conflict" class="${button({ size: "xl", theme: "negative" })}" data-size="sm" data-theme="primary">Save</button>
<button id="compound-helper" class="${button({ variant: "ghost", loading: true, theme: "primary" })}">Save</button>
<button id="compound-mixed" class="${button({ loading: true, theme: "primary" })}" data-variant="ghost">Save</button>
<div class="cui-switch-root" data-size="sm"><div id="switch-inherited" class="cui-switch-control"></div><div id="switch-explicit" class="cui-switch-control" data-size="md"></div></div>
<div id="switch-helper" class="${switchStyles.control({ size: "sm" })}"></div>
<div class="${switchStyles.root({ size: "sm" })}"><div id="root-helper-control" class="cui-switch-control"></div></div>
<div id="body-helper" class="${dialogStyles.body({ layout: "split" })}"></div><div id="body-attribute" class="cui-dialog-panel-content" data-layout="split"></div>
<button id="icon" class="cui-icon-button" data-size="sm" data-theme="primary">X</button>
<button id="close" class="cui-dialog-close-button" data-size="sm" data-theme="primary">X</button>
<div id="dialog" class="${panel({ size: "settings", chrome: "inset" })}" data-motion="none"></div>
<div class="cui-dialog-panel" data-size="settings" data-chrome="inset"><div class="cui-dialog-main"><div id="main-body" class="cui-dialog-panel-content">Settings</div></div></div>
<button id="utility" class="cui-button utility" data-size="md">Utility</button>`;
		const permutations = [
			["button", "icon-button", "dialog"],
			["button", "dialog", "icon-button"],
			["icon-button", "button", "dialog"],
			["icon-button", "dialog", "button"],
			["dialog", "button", "icon-button"],
			["dialog", "icon-button", "button"],
		];
		let expected;
		for (const order of permutations) {
			const html = `<!doctype html><html data-cui-theme="${theme}"><style>@layer cui,utilities;${css.theme}${order.map(n => css[n]).join("\n")}${css.switch}@layer utilities{.utility{width:123px}} *{animation:none!important;transition:none!important}</style><body>${markup}</body></html>`;
			await page.setContent(html);
			const values = await page.evaluate(() =>
				Object.fromEntries(
					[...document.querySelectorAll("[id]")].map(e => {
						const s = getComputedStyle(e);
						return [
							e.id,
							{
								display: s.display,
								width: s.width,
								height: s.height,
								padding: s.padding,
								color: s.color,
								background: s.backgroundColor,
								borderRadius: s.borderRadius,
							},
						];
					}),
				),
			);
			assert.deepEqual(values["default-helper"], values["default-attribute"]);
			count++;
			assert.deepEqual(values.helper, values.attribute);
			count++;
			assert.deepEqual(values.conflict, values.attribute);
			count++;
			assert.deepEqual(values["compound-helper"], values["compound-mixed"]);
			count++;
			assert.equal(values["switch-helper"].width, values["switch-inherited"].width);
			count++;
			assert.notEqual(values["switch-explicit"].width, values["switch-inherited"].width);
			count++;
			assert.deepEqual(values.icon, values.close);
			count++;
			assert.equal(values.icon.width, values.icon.height);
			count++;
			assert.equal(values["root-helper-control"].width, values["switch-helper"].width);
			count++;
			assert.deepEqual(values["body-helper"], values["body-attribute"]);
			count++;
			assert.equal(values["main-body"].display, "flex");
			count++;
			assert.equal(values.utility.width, "123px");
			count++;
			if (expected) assert.deepEqual(values, expected);
			count++;
			expected = values;
			if (order.join() === permutations[0].join()) {
				await writeFile(new URL(theme + ".html", directory), html);
				await page.screenshot({ path: new URL(theme + ".png", directory).pathname });
			}
		}
	}
	console.log(
		`${count} CSS contract assertions passed in Chromium (both themes, six import orders).`,
	);
} finally {
	await browser.close();
}
