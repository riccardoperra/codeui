// Avatar sizes follow the shared control height scale and density; unassigned is a dashed empty circle.
export default async ({ page, check }) => {
	await check("sizes match the control scale per density", () =>
		page.locator("[data-cui-density]").evaluateAll(groups =>
			(() => {
				const expected = {
					compact: [24, 32, 38, 46],
					comfortable: [28, 36, 44, 52],
					touch: [32, 40, 50, 58],
				};
				const actual = Object.fromEntries(
					groups.map(g => [
						g.getAttribute("data-cui-density"),
						[...g.querySelectorAll("[data-cui=avatar]:not([data-unassigned])")]
							.filter((_, i) => i % 2 === 0)
							.map(a => a.getBoundingClientRect().height),
					]),
				);
				return {
					pass: JSON.stringify(actual) === JSON.stringify(expected),
					actual,
					expected,
				};
			})(),
		),
	);
	await check("unassigned is a dashed empty circle in secondary text colour", () =>
		page
			.locator("[data-cui=avatar][data-unassigned]")
			.first()
			.evaluate(a => {
				const c = getComputedStyle(a);
				return {
					pass:
						c.borderTopStyle === "dashed" &&
						a.childElementCount === 0 &&
						c.backgroundColor === "rgba(0, 0, 0, 0)" &&
						a.getAttribute("aria-label") === "Unassigned",
					border: c.borderTopStyle,
					color: c.borderTopColor,
				};
			}),
	);
	await check("the picture covers the circle and keeps the ring", () =>
		page
			.locator("[data-cui=avatar-image]")
			.first()
			.evaluate(img => ({
				pass:
					img.complete &&
					img.naturalWidth > 0 &&
					img.getBoundingClientRect().width ===
						img.parentElement.getBoundingClientRect().width,
				natural: img.naturalWidth,
			})),
	);
};
