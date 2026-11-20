import assert from "node:assert/strict";

export async function checkHydration(page, url) {
	const errors = [];
	page.on("pageerror", error => errors.push(error.message));
	page.on("console", message => {
		const text = message.text();
		if (message.type() === "error" || /hydration key miss|hydration.*mismatch/i.test(text))
			errors.push(text);
	});
	let release;
	const scripts = new Promise(resolve => {
		release = resolve;
	});
	await page.route("**/assets/*.js", async route => {
		await scripts;
		await route.continue();
	});
	try {
		await page.goto(url, {
			waitUntil: "commit",
		});
		await page.locator('[data-cui="dialog-panel"]').waitFor();
		await page.locator('[data-cui="popover-content"]').waitFor();
		await page.evaluate(() => {
			window.__KIT_SERVER_NODES__ = [
				...document.querySelectorAll(
					'[data-cui="dialog-panel"], [data-cui="popover-content"]',
				),
			];
		});
	} finally {
		release();
	}
	await page.waitForFunction(() => window.__KIT_HYDRATED__);
	const adoption = await page.evaluate(() => {
		const nodes = [
			...document.querySelectorAll(
				'[data-cui="dialog-panel"], [data-cui="popover-content"]',
			),
		];
		return (
			nodes.length === 2 &&
			window.__KIT_SERVER_NODES__.length === 2 &&
			window.__KIT_SERVER_NODES__.every(
				node => nodes.includes(node) && !document.getElementById("app").contains(node),
			)
		);
	});
	const dialog = page.getByRole("dialog", { name: "Consumer dialog" });
	const popover = page.getByRole("dialog", { name: "Consumer popover" });
	const trigger = dialog.getByRole("button", { name: "Consumer popover trigger" });
	await popover.getByRole("button", { name: "Popover body" }).press("Escape");
	await popover.waitFor({ state: "detached", timeout: 5000 });
	assert.equal(await dialog.isVisible(), true, "Escape closes only the nested popover");
	await page.waitForFunction(
		button => document.activeElement === button,
		await trigger.elementHandle({ timeout: 5000 }),
		{ timeout: 5000 },
	);
	await trigger.press("Escape");
	await dialog.waitFor({ state: "detached", timeout: 5000 });

	return { adoption, errors };
}
