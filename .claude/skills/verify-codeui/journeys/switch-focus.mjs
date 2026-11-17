// A mouse click toggles without the keyboard ring; Tab and Space show it.
export default async ({ page, step, check, axe }) => {
	const control = page.locator('[data-cui="switch-control"]').first();
	const ring = () => control.evaluate(c => getComputedStyle(c).outlineStyle);
	await step("click the first switch", () => control.click());
	await check("the click toggles it", async () =>
		page.getByRole("switch").first().isChecked(),
	);
	await check("no focus ring after a mouse click", async () => {
		const style = await ring();
		return { pass: style === "none", outline: style };
	});
	// The harness forces reduced motion and turns transitions off, so motion is
	// not provable here; tools outside the harness sample it.
	await step("press Space", () => page.keyboard.press("Space"));
	await check("Space toggles back and shows the ring", async () => {
		const checked = await page.getByRole("switch").first().isChecked();
		const style = await ring();
		return { pass: !checked && style === "solid", checked, outline: style };
	});
	await step("click outside, then Tab back in", async () => {
		await page.mouse.click(1200, 880);
		await page.keyboard.press("Tab");
	});
	await check("Tab focus shows the ring", async () => {
		const style = await ring();
		return { pass: style === "solid", outline: style };
	});
	await axe("keyboard-focus");
};
