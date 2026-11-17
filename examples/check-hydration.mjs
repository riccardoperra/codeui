export async function checkHydration(page, url) {
	const errors = [];
	page.on("pageerror", error => errors.push(error.message));
	page.on("console", message => {
		if (message.type() === "error") errors.push(message.text());
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
	return { adoption, errors };
}
