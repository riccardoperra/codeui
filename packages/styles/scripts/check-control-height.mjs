import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const styles = await Promise.all(
	["theme", "button", "field", "dropdownmenu"].map(name =>
		readFile(new URL(`../dist/${name}.css`, import.meta.url), "utf8"),
	),
);
const browser = await chromium.launch();
try {
	for (const hasTouch of [false, true]) {
		const page = await browser.newPage({ hasTouch, isMobile: hasTouch });
		try {
			await page.setContent(`
				<style>${styles.join("\n")}</style>
				<button class="cui-button">Save</button>
				<input class="cui-field cui-field-input" data-size="sm" />
				<section data-cui-density="compact">
					<input class="cui-field cui-field-input" data-size="sm" />
					<button class="cui-button">Save</button>
					<div data-cui-density="comfortable">
						<button class="cui-button">Save</button>
					</div>
				</section>
				<div class="cui-dropdownmenu-content" role="menu" data-expanded data-motion="none">
					<div class="cui-dropdownmenu-item" role="menuitem">Edit</div>
					<hr class="cui-dropdownmenu-separator" />
					<div class="cui-dropdownmenu-item" role="menuitem">Duplicate</div>
					<div class="cui-dropdownmenu-separator" role="separator"></div>
					<div class="cui-dropdownmenu-item" role="menuitem">Delete</div>
				</div>
			`);
			const heights = await page
				.locator("button")
				.evaluateAll(buttons =>
					buttons.map(button => button.getBoundingClientRect().height),
				);
			assert.deepEqual(heights, [hasTouch ? 40 : 36, 32, 36]);
			const fieldText = await page
				.locator("input")
				.evaluateAll(inputs => inputs.map(input => getComputedStyle(input).fontSize));
			assert.deepEqual(
				fieldText,
				hasTouch ? ["16px", "16px"] : ["14px", "14px"],
				"field text stays at 16px on touch devices at any density",
			);
			const separatorHeights = await page
				.getByRole("separator")
				.evaluateAll(separators =>
					separators.map(separator => separator.getBoundingClientRect().height),
				);
			assert.deepEqual(
				separatorHeights,
				[1, 1],
				"both separator elements draw a single line",
			);
		} finally {
			await page.close();
		}
	}
} finally {
	await browser.close();
}
