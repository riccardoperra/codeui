// Settings layout journey for designsystem-dialog--settings-layout (open on load).
// node .claude/skills/verify-codeui/scripts/drive.mjs designsystem-dialog--settings-layout --journey .claude/skills/verify-codeui/journeys/dialog-layouts.mjs
export default async ({ page, step, check, focus, axe }) => {
	const dialog = page.getByRole("dialog");
	const nav = dialog.getByRole("navigation", { name: "Settings sections" });
	const items = nav.getByRole("button");
	const current = async () => (await nav.locator("[aria-current=page]").textContent())?.trim();

	await check("settings panel is 1000×680, two panes, nav is a list", async () => {
		const box = await dialog.boundingBox();
		const listItems = await nav.getByRole("listitem").count();
		return { pass: box.width === 1000 && box.height === 680 && listItems === 6, box, listItems };
	});
	await check("General is current, named by the breadcrumb", async () => ({
		pass: (await current()) === "General" && (await dialog.getAttribute("aria-labelledby")) !== null,
		current: await current(),
		name: await dialog.locator("[data-cui=dialog-title]").textContent(),
	}));
	await axe("settings-open");

	await step("focus the current section", () => items.first().focus());
	await step("press ArrowDown twice", async () => {
		await page.keyboard.press("ArrowDown");
		await page.keyboard.press("ArrowDown");
	});
	await check("focus moved to Export, current unchanged", async () => ({
		pass: (await focus()).name === "Export" && (await current()) === "General",
		focus: await focus(),
	}));
	await step("press Enter", () => page.keyboard.press("Enter"));
	await check("Export is current and the breadcrumb follows", async () => {
		const title = (await dialog.locator("[data-cui=dialog-title]").textContent())?.trim();
		return { pass: (await current()) === "Export" && title === "Settings / Export", title };
	});
	await step("press End then ArrowDown", async () => {
		await page.keyboard.press("End");
		await page.keyboard.press("ArrowDown");
	});
	await check("arrow keys wrap to the first section", async () => ({ pass: (await focus()).name === "General", focus: await focus() }));

	await step("press Escape", async () => {
		await page.keyboard.press("Escape");
		await dialog.waitFor({ state: "hidden" });
	});
	await check("focus returned to the trigger", async () => ({ pass: (await focus()).name === "Open settings", focus: await focus() }));
	await step("press Enter on the trigger", async () => {
		await page.keyboard.press("Enter");
		await dialog.waitFor({ state: "visible" });
	});
	await check("keyboard open does not animate (data-motion=none on panel and scrim)", async () => {
		const panel = await dialog.getAttribute("data-motion");
		const positioner = await page.locator("[data-cui=dialog-positioner]").getAttribute("data-motion");
		return { pass: panel === "none" && positioner === "none", panel, positioner };
	});

	await step("resize to 390×844", () => page.setViewportSize({ width: 390, height: 844 }));
	await check("phone: 8px gutter, header on top, sections three to a row", async () => {
		const box = await dialog.boundingBox();
		const title = await dialog.locator("[data-cui=dialog-panel-title]").boundingBox();
		const sidebar = await dialog.locator("[data-cui=dialog-sidebar]").boundingBox();
		const cols = await nav.locator("ul").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
		return { pass: box.x === 8 && box.y === 8 && title.y < sidebar.y && cols === 3, box, title, sidebar, cols };
	});
	await axe("settings-phone");
};
