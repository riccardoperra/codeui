// SettingsRow and SettingsGroup journey for designsystem-settings--dialog.
// node .claude/skills/verify-codeui/scripts/drive.mjs designsystem-settings--dialog --journey .claude/skills/verify-codeui/journeys/settings-row.mjs
// Expected values were measured with getComputedStyle on CodeImage's Settings dialog (codeimage-preview.pages.dev, 2026-11-17).
const CODEIMAGE = {
	dark: { island: "rgb(15, 15, 16)", pane: "rgb(21, 21, 22)", title: "rgb(237, 237, 237)", description: "rgb(153, 153, 153)" },
	light: { island: "rgb(247, 250, 252)", pane: "rgb(255, 255, 255)", title: "rgb(74, 85, 104)", description: "rgb(74, 85, 104)" },
};

export default async ({ page, step, check, focus, axe, theme }) => {
	const expected = CODEIMAGE[theme];
	const row = id => page.locator(`[data-cui=settings-row-root]#${id}`);
	const style = (locator, keys) =>
		locator.evaluate((el, keys) => {
			const cs = getComputedStyle(el);
			const r = el.getBoundingClientRect();
			return { height: Math.round(r.height), ...Object.fromEntries(keys.map(k => [k, cs[k]])) };
		}, keys);

	await check("island matches CodeImage: canvas fill, 16px radius, 6px 0 padding", async () => {
		const island = await style(page.locator("[data-cui=settings-group-content]").first(), ["backgroundColor", "borderRadius", "padding"]);
		return { pass: island.backgroundColor === expected.island && island.borderRadius === "16px" && island.padding === "6px 0px", island };
	});
	await check("group title matches CodeImage: 16px 600 primary", async () => {
		const title = await style(page.getByRole("heading", { name: "Interface" }), ["fontSize", "fontWeight", "color", "padding"]);
		return { pass: title.fontSize === "16px" && title.fontWeight === "600" && title.color === expected.title && title.padding === "0px 4px", title };
	});
	await check("row matches CodeImage: 56px, 8px 16px padding, 24px gap", async () => {
		const r = await style(row("language"), ["minHeight", "padding", "columnGap"]);
		return { pass: r.height === 56 && r.minHeight === "56px" && r.padding === "8px 16px" && r.columnGap === "24px", r };
	});
	await check("row text matches CodeImage: label 14px 500, description 12px muted", async () => {
		const label = await style(row("language").locator("[data-cui=settings-row-label]"), ["fontSize", "fontWeight", "color"]);
		const description = await style(row("language").locator("[data-cui=settings-row-description]"), ["fontSize", "color"]);
		return {
			pass: label.fontSize === "14px" && label.fontWeight === "500" && label.color === expected.title && description.fontSize === "12px" && description.color === expected.description,
			label,
			description,
		};
	});
	await check("each control is named and described by its row", async () => {
		const language = page.getByRole("tablist", { name: "Language" });
		const visible = page.getByRole("switch", { name: "Visible" });
		const padding = page.getByRole("spinbutton", { name: "Padding" });
		const describedBy = await language.getAttribute("aria-describedby");
		const description = describedBy ? await page.locator(`#${describedBy}`).textContent() : null;
		return {
			pass: (await language.count()) === 1 && (await visible.count()) === 1 && (await padding.count()) === 1 && description === "The language of the menus, labels and messages.",
			description,
		};
	});
	await axe("rendered-desktop");

	await step("tab to the Language segments", async () => {
		for (let i = 0; i < 5 && (await focus()).role !== "tab"; i++) await page.keyboard.press("Tab");
	});
	await check("focus is on the selected Language segment", async () => {
		const f = await focus();
		return { pass: f.role === "tab" && f.name === "English", focus: f };
	});
	await step("tab past both segmented controls to the Visible switch", async () => {
		for (let i = 0; i < 5 && (await focus()).role !== "switch"; i++) await page.keyboard.press("Tab");
	});
	await check("focus is on the switch named Visible", async () => ({
		pass: await page.getByRole("switch", { name: "Visible" }).evaluate(el => el === document.activeElement),
		focus: await focus(),
	}));
	await step("press Space", () => page.keyboard.press("Space"));
	await check("Space turns Visible off", async () => ({ pass: !(await page.getByRole("switch", { name: "Visible" }).isChecked()) }));

	await step("resize to a 390px phone", () => page.setViewportSize({ width: 390, height: 844 }));
	await check("a segmented row stacks its control under the text", async () => {
		const label = await row("language").locator("[data-cui=settings-row-label]").boundingBox();
		const description = await row("language").locator("[data-cui=settings-row-description]").boundingBox();
		const control = await row("language").locator("[data-cui=settings-row-control]").boundingBox();
		const rowBox = await row("language").boundingBox();
		return {
			pass: control.y >= description.y + description.height && label.x === control.x,
			label,
			control,
			rowBox,
		};
	});
	await check("a compactControl row keeps its switch inline", async () => {
		const label = await row("visible").locator("[data-cui=settings-row-label]").boundingBox();
		const control = await row("visible").locator("[data-cui=settings-row-control]").boundingBox();
		return { pass: control.x > label.x + label.width && control.y < label.y + label.height + 20, label, control };
	});
	await check("nothing overflows the phone width", async () => {
		const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: innerWidth }));
		const islands = await page.locator("[data-cui=settings-group-content]").evaluateAll(els => els.map(el => el.scrollWidth <= el.clientWidth));
		return { pass: sizes.scroll <= sizes.inner && islands.every(Boolean), sizes, islands };
	});
	await axe("phone");
};
