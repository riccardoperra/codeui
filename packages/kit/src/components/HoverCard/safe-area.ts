import type { Polygon } from "@kobalte/utils";

/** The region the pointer may cross from the trigger to the card without closing it, after Kobalte's HoverCard. */
export function safeArea(trigger: HTMLElement, content: HTMLElement): Polygon {
	const a = trigger.getBoundingClientRect();
	const f = content.getBoundingClientRect();
	const centerX = a.left + a.width / 2;
	const centerY = a.top + a.height / 2;
	if (f.left >= a.right)
		return [[centerX, a.top], [f.left, f.top], [f.right, f.top], [f.right, f.bottom], [f.left, f.bottom], [centerX, a.bottom]];
	if (f.right <= a.left)
		return [[centerX, a.top], [f.right, f.top], [f.left, f.top], [f.left, f.bottom], [f.right, f.bottom], [centerX, a.bottom]];
	if (f.top >= a.bottom)
		return [[a.left, centerY], [f.left, f.top], [f.left, f.bottom], [f.right, f.bottom], [f.right, f.top], [a.right, centerY]];
	return [[a.left, centerY], [f.left, f.bottom], [f.left, f.top], [f.right, f.top], [f.right, f.bottom], [a.right, centerY]];
}
