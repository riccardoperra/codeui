// HoverCard opens on a touch tap without following the link, sits on the right of its
// trigger by default, keeps the Pop surface, and a second tap closes nothing.
export default async ({ page, step, check, axe, theme }) => {
	const content = page.locator("[data-cui=hovercard-content]");
	const trigger = page.locator("[data-cui=hovercard-trigger]");
	const startUrl = page.url();
	await step("Tap the trigger with a touch pointer", async () => {
		await trigger.dispatchEvent("pointerdown", { pointerType: "touch", bubbles: true });
		await trigger.dispatchEvent("pointerup", { pointerType: "touch", bubbles: true });
		await trigger.dispatchEvent("click", { bubbles: true, cancelable: true });
		await content.waitFor({ timeout: 2000 });
	});
	await check("tap opens the card and does not follow the link", async () => ({
		pass: (await content.count()) === 1 && page.url() === startUrl,
		url: page.url(),
	}));
	const geometry = async () => {
		const t = await trigger.boundingBox();
		const c = await content.boundingBox();
		return { triggerRight: t.x + t.width, cardLeft: c.x, cardWidth: c.width };
	};
	await check("the card sits on the right of the trigger", async () => {
		const g = await geometry();
		return { pass: g.cardLeft >= g.triggerRight, ...g };
	});
	await check("floating surface: dialog fill, shadow, radius 16, max width 20rem", () =>
		content.evaluate((el, theme) => {
			const c = getComputedStyle(el);
			return {
				pass:
					c.backgroundColor ===
						(theme === "dark" ? "rgb(37, 37, 37)" : "rgb(255, 255, 255)") &&
					c.borderRadius === "16px" &&
					c.maxWidth === "320px" &&
					c.boxShadow !== "none" &&
					(theme === "light" || c.boxShadow.includes("inset")),
				bg: c.backgroundColor,
				radius: c.borderRadius,
				maxWidth: c.maxWidth,
				shadow: c.boxShadow,
			};
		}, theme),
	);
	await axe("open");
	await step("Tap outside", async () => {
		await page.mouse.click(1200, 850);
		await content.waitFor({ state: "detached", timeout: 2000 });
	});
	await check("an outside press closes the card", async () => ({
		pass: (await content.count()) === 0,
	}));
	await step("Click the trigger with a mouse", async () => {
		const box = await trigger.boundingBox();
		await page.mouse.click(box.x + 8, box.y + box.height / 2);
		await page.waitForTimeout(100);
	});
	await check("a click opens the card at once, without the 500ms delay", async () => ({
		pass: (await content.count()) === 1,
	}));
};
