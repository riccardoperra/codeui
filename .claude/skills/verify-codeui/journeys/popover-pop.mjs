// Popover: keyboard opens in place (data-motion=none), a pointer opens with the Pop
// from the trigger side. Asserts the CodeImage floating surface and type.
export default async ({ page, step, check, focus, axe, theme }) => {
	const content = page.locator("[data-cui=popover-content]");
	const style = () =>
		content.evaluate(el => {
			const c = getComputedStyle(el);
			const title = el.querySelector("[data-cui=popover-title]") ?? el.querySelector("h2");
			return {
				motion: el.getAttribute("data-motion"),
				bg: c.backgroundColor,
				radius: c.borderRadius,
				fontSize: c.fontSize,
				lineHeight: c.lineHeight,
				origin: c.transformOrigin,
				originVar: c.getPropertyValue("--kb-popper-content-transform-origin").trim(),
				titleSize: title && getComputedStyle(title).fontSize,
			};
		});
	await step("Tab to trigger and press Enter", async () => {
		await page.keyboard.press("Tab");
		await page.keyboard.press("Enter");
		await content.waitFor();
	});
	const kbd = await style();
	await check("keyboard open has data-motion=none", () => ({ pass: kbd.motion === "none", ...kbd }));
	await check("surface is the dialog surface, radius 18, 14px text with an explicit line height", () => ({
		pass:
			kbd.bg === (theme === "dark" ? "rgb(29, 29, 29)" : "rgb(255, 255, 255)") &&
			kbd.radius === "18px" &&
			kbd.fontSize === "14px" &&
			kbd.lineHeight === "18.2px",
		...kbd,
	}));
	await axe("open");
	await step("Escape closes", () => page.keyboard.press("Escape"));
	await check("focus returns to trigger", async () => (await focus()).dataCui === "popover-trigger");
	await step("Click opens", async () => {
		await page.locator("[data-cui=popover-trigger]").first().click();
		await content.waitFor();
	});
	const ptr = await style();
	await check("pointer open plays the Pop from the trigger side", () => ({
		pass: ptr.motion === null && ptr.originVar !== "",
		...ptr,
	}));
};
