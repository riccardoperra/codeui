// Select in a form: pick a value with the keyboard, submit, and read FormData through the story's output.
export default async ({ page, step, check, focus, axe }) => {
	const out = page.locator("output");
	await step("tab to the trigger", async () => {
		for (let i = 0; i < 4 && (await focus()).dataCui !== "select-trigger"; i++) await page.keyboard.press("Tab");
	});
	await check("focus on the select trigger", async () => ({ pass: (await focus()).dataCui === "select-trigger", focus: await focus() }));
	await step("open the list", () => page.keyboard.press("ArrowDown"));
	await step("move to SVG and pick it", async () => {
		await page.getByRole("option", { name: "PNG" }).waitFor();
		await page.keyboard.press("ArrowDown");
		await page.keyboard.press("Enter");
	});
	await check("the trigger shows SVG", async () => {
		const value = await page.locator("[data-cui=select-value]").textContent();
		return { pass: value === "SVG", value };
	});
	await step("Tab to Submit and press Enter", async () => {
		for (let i = 0; i < 4 && (await focus()).name !== "Submit"; i++) await page.keyboard.press("Tab");
		await page.keyboard.press("Enter");
	});
	await check("the form submits format=SVG", async () => {
		const text = await out.textContent();
		return { pass: text === "Submitted format=SVG", text };
	});
	await axe("submitted");
};
