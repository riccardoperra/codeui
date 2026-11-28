// A list in a hover card: one line per entry, nesting by indent, truncated titles,
// capped near 24rem with its own scroll.
export default async ({ page, step, check, axe }) => {
	const content = page.locator("[data-cui=hovercard-content]");
	await step("Tab to the trigger", async () => {
		await page.keyboard.press("Tab");
		await content.waitFor({ timeout: 2000 });
	});
	await check("the list caps at 24rem and scrolls on its own", () =>
		page.locator("[data-cui=hovercard-list]").evaluate(el => ({
			pass:
				el.clientHeight <= 384 &&
				el.clientHeight > 300 &&
				el.scrollHeight > el.clientHeight &&
				getComputedStyle(el).overflowY === "auto",
			clientHeight: el.clientHeight,
			scrollHeight: el.scrollHeight,
		})),
	);
	await check("every entry is one line: icon, identifier, truncated title", () =>
		page.locator("[data-cui=hovercard-item]").evaluateAll(items => {
			const heights = [
				...new Set(items.map(item => Math.round(item.getBoundingClientRect().height))),
			];
			const title = items[2].querySelector("[data-cui=hovercard-item-title]");
			return {
				pass:
					heights.length === 1 &&
					heights[0] <= 32 &&
					title.scrollWidth > title.clientWidth &&
					getComputedStyle(title).textOverflow === "ellipsis" &&
					items.every(
						item =>
							item.querySelector("[data-cui=hovercard-item-icon]") &&
							item.querySelector("[data-cui=hovercard-item-id]"),
					),
				heights,
				truncated: title.scrollWidth > title.clientWidth,
			};
		}),
	);
	await check("nesting is shown by indent, 16px per level", () =>
		page.locator("[data-cui=hovercard-item]").evaluateAll(items => {
			const left = i =>
				items[i].querySelector("[data-cui=hovercard-item-icon]").getBoundingClientRect()
					.left;
			return {
				pass: left(1) - left(0) === 16 && left(3) - left(0) === 32,
				d1: left(1) - left(0),
				d2: left(3) - left(0),
			};
		}),
	);
	await check("state icons are named", async () => {
		const names = await page.getByRole("img", { name: "Running" }).count();
		return { pass: names > 0, running: names };
	});
	await step("Scroll the list to the end", async () => {
		await page
			.locator("[data-cui=hovercard-list]")
			.evaluate(el => el.scrollTo(0, el.scrollHeight));
	});
	await check(
		"the card stays open and the same size while the list scrolls",
		async () => {
			const box = await content.boundingBox();
			return {
				pass: (await content.count()) === 1 && box.height < 480,
				height: box.height,
			};
		},
	);
	await axe("open");
};
