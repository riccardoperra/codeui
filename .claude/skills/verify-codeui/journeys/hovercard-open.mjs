// HoverCard: keyboard focus opens it in place (data-motion=none) and Escape closes it with
// focus kept on the trigger; a resting pointer opens it, and moving away closes it.
export default async ({ page, step, check, focus, axe, theme }) => {
	const content = page.locator("[data-cui=hovercard-content]");
	const trigger = page.locator("[data-cui=hovercard-trigger]");
	const surface = () =>
		content.evaluate(el => {
			const c = getComputedStyle(el);
			return {
				motion: el.getAttribute("data-motion"),
				bg: c.backgroundColor,
				radius: c.borderRadius,
				maxWidth: c.maxWidth,
				origin: c.getPropertyValue("--cui-popper-content-transform-origin").trim(),
			};
		});
	await step("Tab to the trigger", async () => {
		await page.keyboard.press("Tab");
		await content.waitFor({ timeout: 2000 });
	});
	const kbd = await surface();
	await check("focus opens the card without motion, focus stays on the trigger", async () => ({
		pass: kbd.motion === "none" && (await focus()).dataCui === "hovercard-trigger",
		...kbd,
	}));
	await check("Popover surface: dialog fill, radius 16, max width 320, origin at the trigger side", () => ({
		pass:
			kbd.bg === (theme === "dark" ? "rgb(37, 37, 37)" : "rgb(255, 255, 255)") &&
			kbd.radius === "16px" &&
			kbd.maxWidth === "320px" &&
			kbd.origin === "left top",
		...kbd,
	}));
	await axe("open");
	await step("Press Escape", async () => {
		await page.keyboard.press("Escape");
		await content.waitFor({ state: "detached", timeout: 2000 });
	});
	await check("Escape closes the card and focus stays on the trigger", async () => ({
		pass: (await content.count()) === 0 && (await focus()).dataCui === "hovercard-trigger",
	}));
	await step("Blur, then rest the pointer on the trigger", async () => {
		await page.evaluate(() => document.activeElement.blur());
		const box = await trigger.boundingBox();
		await page.mouse.move(box.x + 4, box.y + box.height / 2);
		await page.mouse.move(box.x + 8, box.y + box.height / 2);
		await content.waitFor({ timeout: 2000 });
	});
	await check("hover opens the card with motion allowed", async () => {
		const s = await surface();
		return { pass: s.motion === null, ...s };
	});
	await step("Move the pointer far away", async () => {
		await page.mouse.move(5, 800);
		await page.mouse.move(10, 850);
		await content.waitFor({ state: "detached", timeout: 2000 });
	});
	await check("leaving closes the card", async () => ({ pass: (await content.count()) === 0 }));
};
