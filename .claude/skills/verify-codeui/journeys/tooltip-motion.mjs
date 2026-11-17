// Tooltip: Tab opens in place and describes the focused button; hover opens with the Pop.
export default async ({ page, step, check, focus }) => {
	const tooltip = page.getByRole("tooltip");
	await step("Tab to trigger", async () => {
		await page.keyboard.press("Tab");
		await tooltip.waitFor();
	});
	await check("keyboard focus opens without motion", async () => ({
		pass: (await tooltip.getAttribute("data-motion")) === "none",
	}));
	await check("the focused button carries the description", async () => {
		const id = await tooltip.getAttribute("id");
		const own = await page.evaluate(() => document.activeElement.getAttribute("aria-describedby"));
		const wrapper = await page.evaluate(() => document.activeElement.parentElement.getAttribute("aria-describedby"));
		return { pass: own === id && wrapper === null, id, own, wrapper, focus: await focus() };
	});
	await check("explicit line height", async () => {
		const lh = await tooltip.evaluate(el => [getComputedStyle(el).fontSize, getComputedStyle(el).lineHeight]);
		return { pass: lh[1] !== "normal", lh };
	});
	await step("Escape, blur, then hover", async () => {
		await page.keyboard.press("Escape");
		await page.mouse.click(5, 5);
		await page.waitForTimeout(400);
		await page.getByRole("button", { name: "Hover me" }).hover();
		await tooltip.waitFor();
	});
	await check("hover opens with the Pop", async () => ({
		pass: (await tooltip.getAttribute("data-motion")) === null,
	}));
};
