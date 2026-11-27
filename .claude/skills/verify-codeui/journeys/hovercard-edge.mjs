// With no room on the right, the card flips to the left of the trigger.
export default async ({ page, step, check }) => {
	const content = page.locator("[data-cui=hovercard-content]");
	const trigger = page.locator("[data-cui=hovercard-trigger]");
	await step("Tab to the trigger", async () => {
		await page.keyboard.press("Tab");
		await content.waitFor({ timeout: 2000 });
	});
	await check("the card sits on the left of the trigger", async () => {
		const t = await trigger.boundingBox();
		const c = await content.boundingBox();
		return { pass: c.x + c.width <= t.x, cardRight: c.x + c.width, triggerLeft: t.x };
	});
};
