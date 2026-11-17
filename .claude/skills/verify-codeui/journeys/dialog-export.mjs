// Export layout journey for designsystem-dialog--export-layout (open on load).
// node .claude/skills/verify-codeui/scripts/drive.mjs designsystem-dialog--export-layout --journey .claude/skills/verify-codeui/journeys/dialog-export.mjs
export default async ({ page, step, check, axe }) => {
	const dialog = page.getByRole("dialog");
	const body = dialog.locator("[data-cui=dialog-panel-content]");
	const columns = () => body.evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);

	await check("inset chrome: 800 wide, 24px corners, 20px padding, header without divider", async () => {
		const box = await dialog.boundingBox();
		const css = await dialog.evaluate(el => ({ radius: getComputedStyle(el).borderRadius, padding: getComputedStyle(el).padding }));
		const divider = await dialog.locator("[data-cui=dialog-panel-title]").evaluate(el => getComputedStyle(el).borderBottomStyle);
		return { pass: box.width === 800 && css.radius === "24px" && css.padding === "20px" && divider === "none", box, ...css, divider };
	});
	await check("close button is a ghost icon button", async () => {
		const close = dialog.getByRole("button", { name: "Close" });
		const css = await close.evaluate(el => ({ bg: getComputedStyle(el).backgroundColor, height: el.getBoundingClientRect().height }));
		return { pass: css.bg === "rgba(0, 0, 0, 0)" && css.height === 36, ...css };
	});
	await check("split body has two columns on desktop", async () => ({ pass: (await columns()) === 2, columns: await columns() }));
	await check("More section is a two-column well", async () => {
		const more = dialog.locator("[data-cui=dialog-section][data-variant=well][data-columns='2']");
		const cols = await more.locator("[data-cui=dialog-section-content]").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
		return { pass: cols === 2, cols };
	});
	await axe("export-open");
	await step("resize to 390×844", () => page.setViewportSize({ width: 390, height: 844 }));
	await check("split body stacks on a phone, 16px gutter", async () => {
		const box = await dialog.boundingBox();
		return { pass: (await columns()) === 1 && box.x === 16, columns: await columns(), box };
	});
	await check("More section stacks to one column", async () => {
		const cols = await dialog.locator("[data-cui=dialog-section][data-columns='2'] [data-cui=dialog-section-content]").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
		return { pass: cols === 1, cols };
	});
};
