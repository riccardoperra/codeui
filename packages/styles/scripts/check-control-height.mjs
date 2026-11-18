import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const styles = await Promise.all(
	["theme", "button"].map(name =>
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
				<section data-cui-density="compact">
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
		} finally {
			await page.close();
		}
	}
} finally {
	await browser.close();
}
