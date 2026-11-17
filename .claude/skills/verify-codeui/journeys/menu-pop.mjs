// DropdownMenu: keyboard open in place, pointer open with the Pop; CodeImage row metrics.
export default async ({ page, step, check, focus, axe, theme }) => {
	const menu = page.getByRole("menu").first();
	const measure = () =>
		menu.evaluate(el => {
			const c = getComputedStyle(el);
			const item = el.querySelector("[role=menuitem]");
			const i = getComputedStyle(item);
			return {
				motion: el.getAttribute("data-motion"),
				bg: c.backgroundColor,
				radius: c.borderRadius,
				padding: c.padding,
				width: el.getBoundingClientRect().width,
				rowHeight: item.getBoundingClientRect().height,
				rowFont: i.fontSize,
				rowLineHeight: i.lineHeight,
				rowRadius: i.borderRadius,
			};
		});
	await step("Tab to Menu and press ArrowDown", async () => {
		await page.keyboard.press("Tab");
		await page.keyboard.press("ArrowDown");
		await menu.waitFor();
	});
	const kbd = await measure();
	await check("keyboard open has data-motion=none", () => ({ pass: kbd.motion === "none", ...kbd }));
	await check("dialog surface, 36px rows at 14px with explicit line height", () => ({
		pass:
			kbd.bg === (theme === "dark" ? "rgb(29, 29, 29)" : "rgb(255, 255, 255)") &&
			kbd.rowHeight === 36 &&
			kbd.rowFont === "14px" &&
			kbd.rowLineHeight === "18.2px" &&
			kbd.width >= 192,
		...kbd,
	}));
	await check("focus is on the first item", async () => (await focus()).role === "menuitem");
	await axe("open");
	await step("Escape closes", () => page.keyboard.press("Escape"));
	await check("focus returns to the trigger", async () => (await focus()).name === "Menu");
	await step("Click opens", async () => {
		await page.getByRole("button", { name: "Menu" }).click();
		await menu.waitFor();
	});
	const ptr = await measure();
	await check("pointer open has no data-motion (plays the Pop)", () => ({ pass: ptr.motion === null, ...ptr }));
};
