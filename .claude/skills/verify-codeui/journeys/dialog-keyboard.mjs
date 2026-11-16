// Dialog keyboard journey for designsystem-dialog--sizes.
// node .claude/skills/verify-codeui/scripts/drive.mjs designsystem-dialog--sizes --journey .claude/skills/verify-codeui/journeys/dialog-keyboard.mjs
const OPENER = "Open (sm)";

export default async ({ page, step, check, focus, axe, theme, backgrounds }) => {
	const dialog = page.getByRole("dialog");

	await step(`tab to "${OPENER}"`, async () => {
		for (let i = 0; i < 10 && (await focus()).name !== OPENER; i++) await page.keyboard.press("Tab");
	});
	await check("opener has focus", async () => ({ pass: (await focus()).name === OPENER, focus: await focus() }));

	await step("press Enter", async () => {
		await page.keyboard.press("Enter");
		await dialog.waitFor({ state: "visible" });
	});
	await check("dialog is open with its title", async () => {
		const title = await dialog.getByRole("heading").first().textContent();
		return { pass: title?.trim() === "Dialog title sm", title };
	});
	await check("focus moved inside the dialog", async () => ({ pass: (await focus()).inDialog, focus: await focus() }));
	await check("dialog uses the requested theme", async () => {
		const css = await dialog.evaluate(el => {
			const cs = getComputedStyle(el);
			return { colorScheme: cs.colorScheme, background: cs.backgroundColor, color: cs.color };
		});
		const body = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
		return { pass: css.colorScheme === theme && body === backgrounds[theme] && css.background !== "rgba(0, 0, 0, 0)", body, ...css };
	});
	await axe("dialog-open");

	await step("press Tab inside the dialog", () => page.keyboard.press("Tab"));
	await check("focus stays trapped in the dialog", async () => ({ pass: (await focus()).inDialog, focus: await focus() }));

	await step("press Escape", async () => {
		await page.keyboard.press("Escape");
		await dialog.waitFor({ state: "hidden" });
	});
	await check("dialog closed", async () => ({ pass: (await dialog.count()) === 0 }));
	await check("focus returned to the opener", async () => ({ pass: (await focus()).name === OPENER, focus: await focus() }));
};
