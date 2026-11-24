// Resizable sidebar: arrow keys move the handle, End stops at maxSize (360px), Home at
// minSize (200px); the focused handle shows the focus colour.
export default async ({ page, step, check, focus, axe }) => {
	const sidebar = page.locator("[data-testid=sidebar]");
	const handle = page.getByRole("separator", { name: "Resize sidebar" });
	const width = () => sidebar.evaluate(el => Math.round(el.getBoundingClientRect().width));
	const line = () =>
		handle.evaluate(el => {
			const c = getComputedStyle(el, "::before");
			return { color: c.backgroundColor, width: c.width, focusColor: getComputedStyle(document.documentElement).getPropertyValue("--cui-focus-color").trim() };
		});
	await check("sidebar starts at 240px", async () => {
		const w = await width();
		return { pass: w === 240, width: w };
	});
	await step("Tab to the handle", async () => {
		await page.keyboard.press("Tab");
	});
	await check("handle has focus and shows a 2px focus-colour line", async () => {
		const f = await focus();
		const l = await line();
		return { pass: f.role === "separator" && l.width === "2px", focus: f, ...l };
	});
	await axe("focused");
	await step("ArrowRight", async () => page.keyboard.press("ArrowRight"));
	await check("ArrowRight widens the sidebar", async () => {
		const w = await width();
		return { pass: w > 240 && w <= 360, width: w };
	});
	await step("End", async () => page.keyboard.press("End"));
	await check("End stops at maxSize 360px", async () => {
		const w = await width();
		return { pass: w === 360, width: w };
	});
	await step("ArrowRight past the max", async () => page.keyboard.press("ArrowRight"));
	await check("the sidebar stays at 360px", async () => {
		const w = await width();
		return { pass: w === 360, width: w };
	});
	await step("Home", async () => page.keyboard.press("Home"));
	await check("Home stops at minSize 200px", async () => {
		const w = await width();
		return { pass: w === 200, width: w };
	});
};
