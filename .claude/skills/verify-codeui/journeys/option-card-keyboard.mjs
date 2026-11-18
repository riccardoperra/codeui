// Arrow keys move the selection; the selected card has the inset accent ring,
// keyboard focus draws one ring outside it.
export default async ({ page, step, check, focus, axe }) => {
	const radios = page.getByRole("radio");
	const labels = page.locator('[data-cui="optioncard-item-label"]');
	await step("Tab into the group", () => page.keyboard.press("Tab"));
	await check("focus lands on the selected card", async () =>
		radios.nth(0).evaluate(el => el === document.activeElement),
	);
	await check("focused card has one 2px ring outside the edge", async () => {
		const s = await labels
			.nth(0)
			.evaluate(l => ({
				o: getComputedStyle(l).outline,
				off: getComputedStyle(l).outlineOffset,
				border: getComputedStyle(l).borderTopWidth,
			}));
		return {
			pass: s.o.startsWith("2px solid") && s.off === "2px" && s.border === "0px",
			...s,
		};
	});
	await step("ArrowRight", () => page.keyboard.press("ArrowRight"));
	await check("ArrowRight selects the next card", async () => radios.nth(1).isChecked());
	await check("the card that lost focus keeps no ring", async () => {
		const o = await labels.nth(0).evaluate(l => getComputedStyle(l).outlineStyle);
		return { pass: o === "none", outline: o };
	});
	await step("Tab out", () => page.keyboard.press("Tab"));
	await check("the selected card shows the inset accent ring", async () => {
		const s = await labels
			.nth(1)
			.evaluate(l => ({
				o: getComputedStyle(l).outline,
				off: getComputedStyle(l).outlineOffset,
				weight: getComputedStyle(l.querySelector("span span")).fontWeight,
			}));
		return {
			pass: s.o.startsWith("2px solid") && s.off === "-2px" && s.weight === "600",
			...s,
		};
	});
	await check("preview well is 68px", async () => {
		const h = await page
			.locator('[data-cui="optioncard-preview"]')
			.first()
			.evaluate(p => p.getBoundingClientRect().height);
		return { pass: h === 68, h };
	});
	await axe("after-keyboard");
};
