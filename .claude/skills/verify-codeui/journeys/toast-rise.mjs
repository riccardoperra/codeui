// Toaster: the toast uses the inverted theme and sits 80px from the bottom of its frame.
export default async ({ page, step, check, theme }) => {
	const toast = page.getByRole("status").first();
	await step("toasts shown", () => toast.waitFor());
	await check("inverted theme", async () => {
		const value = await toast.getAttribute("data-cui-theme");
		const bg = await toast.evaluate(el => getComputedStyle(el).backgroundColor);
		return { pass: value === (theme === "dark" ? "light" : "dark"), value, bg };
	});
	await check("80px from the bottom of the frame, radius 16, explicit line height", async () => {
		const m = await page.evaluate(() => {
			const region = document.querySelector("[data-cui=toast-region]");
			const frame = region.parentElement.getBoundingClientRect();
			const toasts = [...document.querySelectorAll("[role=status]")];
			const last = toasts.at(-1).getBoundingClientRect();
			const c = getComputedStyle(toasts.at(-1));
			return { gap: Math.round(frame.bottom - last.bottom), radius: c.borderRadius, fontSize: c.fontSize, lineHeight: c.lineHeight };
		});
		return { pass: m.gap === 80 && m.radius === "16px" && m.lineHeight !== "normal", ...m };
	});
};
