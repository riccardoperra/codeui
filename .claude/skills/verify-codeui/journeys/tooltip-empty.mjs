// Tooltip: empty content (undefined, null, "") never opens on hover or focus and adds no aria-describedby;
// a sibling tooltip with content still opens on both.
export default async ({ page, step, check, focus, axe }) => {
	const tooltip = page.getByRole("tooltip");
	const empties = ["Undefined", "Null", "Empty string"];
	const bubbles = () => page.locator("[data-cui=tooltip-content]").count();

	for (const name of empties) {
		await step(`hover ${name}`, async () => {
			await page.getByRole("button", { name }).hover();
			await page.waitForTimeout(600);
		});
		await check(`hover ${name}: no bubble`, async () => ({
			pass: (await bubbles()) === 0,
			count: await bubbles(),
		}));
		await page.mouse.move(1200, 850);
	}

	for (const [i, name] of empties.entries()) {
		await step(`Tab to ${name}`, async () => {
			await page.keyboard.press("Tab");
			await page.waitForTimeout(600);
		});
		await check(`focus ${name}: no bubble, no aria-describedby`, async () => {
			const f = await focus();
			const describedBy = await page.evaluate(() =>
				document.activeElement.getAttribute("aria-describedby"),
			);
			const count = await bubbles();
			return {
				pass: f.name === name && count === 0 && describedBy === null,
				focus: f,
				count,
				describedBy,
			};
		});
	}
	await axe("empty-focused");

	await step("Tab to With content", async () => {
		await page.keyboard.press("Tab");
		await tooltip.waitFor();
	});
	await check("focus With content: bubble opens and describes the button", async () => {
		const id = await tooltip.getAttribute("id");
		const own = await page.evaluate(() =>
			document.activeElement.getAttribute("aria-describedby"),
		);
		const text = await tooltip.textContent();
		return {
			pass: own === id && text.includes("My tooltip content."),
			id,
			own,
			text,
			focus: await focus(),
		};
	});
	await step("Escape, blur, hover With content", async () => {
		await page.keyboard.press("Escape");
		await page.mouse.click(5, 5);
		await page.waitForTimeout(400);
		await page.getByRole("button", { name: "With content" }).hover();
		await tooltip.waitFor();
	});
	await check("hover With content: bubble opens", async () => ({
		pass: (await tooltip.isVisible()) && (await bubbles()) === 1,
	}));
};
