import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const styles = await Promise.all(
	["theme", "button", "field"].map(name =>
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
				<button class="cui-button-button">Save</button>
				<input class="cui-field-baseFieldTheme cui-field-baseFieldVariants" data-size="sm" />
				<section data-cui-density="compact">
					<input class="cui-field-baseFieldTheme cui-field-baseFieldVariants" data-size="sm" />
					<button class="cui-button-button">Save</button>
					<div data-cui-density="comfortable">
						<button class="cui-button-button">Save</button>
					</div>
				</section>
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
		} finally {
			await page.close();
		}
	}
} finally {
	await browser.close();
}
