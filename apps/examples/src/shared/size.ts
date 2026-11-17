import { createIsPhone } from "./media";

/**
 * Inkstone controls are 36px on desktop and 40px on a phone (DESIGN.md §6). In the kit those are
 * the `sm` and `md` sizes.
 */
export function createControlSize() {
	const isPhone = createIsPhone();
	return () => (isPhone() ? "md" : "sm") as "sm" | "md";
}
