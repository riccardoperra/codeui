// Avatar: initials reach 4.5:1 on their hue in both themes, the ring is a neutral
// 16-35% line, sizes follow the control scale, hover shows the name in the kit Tooltip.
export default async ({ page, step, check, axe }) => {
	const contrast = () =>
		page.locator("[data-cui=avatar]").evaluateAll(avatars => {
			const canvas = document.createElement("canvas");
			canvas.width = canvas.height = 1;
			const ctx = canvas.getContext("2d", { willReadFrequently: true });
			const rgb = color => {
				ctx.clearRect(0, 0, 1, 1);
				ctx.fillStyle = color;
				ctx.fillRect(0, 0, 1, 1);
				return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
			};
			const lum = ([r, g, b]) =>
				[r, g, b]
					.map(v => v / 255)
					.map(v => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
					.reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
			const ratio = (a, b) => {
				const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
				return (hi + 0.05) / (lo + 0.05);
			};
			return avatars
				.filter(
					a =>
						a.querySelector("[data-cui=avatar-fallback]") &&
						!a.hasAttribute("data-unassigned"),
				)
				.map(a => {
					const c = getComputedStyle(a);
					return {
						name: a.getAttribute("aria-label"),
						ratio: Math.round(ratio(rgb(c.backgroundColor), rgb(c.color)) * 100) / 100,
						ring: getComputedStyle(a, "::after").boxShadow,
						radius: c.borderRadius,
					};
				});
		});
	const rows = await contrast();
	await check("initials reach 4.5:1 on every hue", () => ({
		pass: rows.length > 0 && rows.every(r => r.ratio >= 4.5),
		min: Math.min(...rows.map(r => r.ratio)),
		rows,
	}));
	await check("hues differ by id, and the same name with different ids differs", () =>
		page.locator("[data-cui=avatar]").evaluateAll(avatars => {
			const fills = avatars.map(a => getComputedStyle(a).backgroundColor);
			const sam = avatars
				.filter(a => a.getAttribute("aria-label") === "Sam Lee")
				.map(a => getComputedStyle(a).backgroundColor);
			return {
				pass: new Set(fills.slice(0, 8)).size === 8 && new Set(sam).size === 3,
				sam,
			};
		}),
	);
	await check("full radius and a neutral ring at 20% alpha", () => {
		const ring = rows[0].ring;
		const alpha = Number(/(?:\/\s*|,\s*)([\d.]+)\)/.exec(ring)?.[1]);
		return {
			pass:
				rows.every(r => r.radius === "9999px" || parseFloat(r.radius) >= 9999) &&
				/inset/.test(ring) &&
				alpha >= 0.16 &&
				alpha <= 0.35,
			ring,
			alpha,
			radius: rows[0].radius,
		};
	});
	await step("Hover Ada Lovelace", async () => {
		await page.getByRole("img", { name: "Ada Lovelace" }).hover();
		await page.locator("[data-cui=tooltip-content]").waitFor({ timeout: 2000 });
	});
	await check("the tooltip shows the name", async () => {
		const text = await page.locator("[data-cui=tooltip-content]").innerText();
		return { pass: text.trim() === "Ada Lovelace", text };
	});
	await axe("tooltip");
};
