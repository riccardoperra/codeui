// The first click on a closed header opens it while another section is open
// (it used to land on the next header: the open body restarted its keyframe).
export default async ({ page, step, check, focus, axe }) => {
	const triggers = page.locator('[data-cui="accordion-trigger"]');
	const expanded = () =>
		triggers.evaluateAll(ts => ts.map(t => t.getAttribute("aria-expanded")));
	await check("one section starts open", async () => {
		const states = await expanded();
		return { pass: states.filter(s => s === "true").length === 1, states };
	});
	await step("click the second header once", () => triggers.nth(1).click());
	await check("the second section opens on the first click", async () => {
		const states = await expanded();
		return { pass: states[1] === "true" && states[0] === "false", states };
	});
	await check("header is 36px with a 14px title", async () => {
		const box = await triggers.nth(1).evaluate(t => {
			const s = getComputedStyle(t);
			return {
				h: t.getBoundingClientRect().height,
				font: s.fontSize,
				weight: s.fontWeight,
			};
		});
		return { pass: box.h === 36 && box.font === "14px" && box.weight === "600", ...box };
	});
	await check("the open chevron is a quarter turn", async () => {
		const transform = await page
			.locator('[data-cui="accordion-chevron"]')
			.nth(1)
			.evaluate(c => getComputedStyle(c).transform);
		return { pass: transform === "matrix(0, 1, -1, 0, 0, 0)", transform };
	});
	await step("Enter on the focused header closes it", () => page.keyboard.press("Enter"));
	await check("keyboard toggles and marks the input", async () => {
		const states = await expanded();
		const input = await page.evaluate(() => document.documentElement.dataset.cuiInput);
		return { pass: states[1] === "false" && input === "keyboard", states, input };
	});
	await check(
		"focus stays on the header",
		async () => (await focus()).dataCui === "accordion-trigger",
	);
	await axe("after-toggle");
};
