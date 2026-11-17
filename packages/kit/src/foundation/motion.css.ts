import { keyframes, StyleRule } from "@vanilla-extract/css";
import { tokens } from "./cui.css";

const fadeIn = keyframes({ from: { opacity: 0 } });
const fadeOut = keyframes({ to: { opacity: 0 } });

/**
 * Enter and exit animation for an overlay that Kobalte marks with
 * `data-expanded`. Reduced motion keeps only a fade. `data-motion=none`
 * (set when the keyboard opened it) shows and hides it in place.
 */
export function presenceAnimation(options: {
	enter: string;
	exit: string;
	enterDuration?: string;
	fillMode?: "forwards";
}): StyleRule {
	const ease = tokens.motion.ease.out;
	const enterDuration = options.enterDuration ?? tokens.motion.duration.normal;
	const fill = options.fillMode ? ` ${options.fillMode}` : "";
	return {
		animation: `${options.exit} ${tokens.motion.duration.fast} ${ease}${fill}`,
		selectors: {
			"&[data-expanded]": { animation: `${options.enter} ${enterDuration} ${ease}` },
			"&[data-motion=none], &[data-motion=none][data-expanded]": { animation: "none" },
		},
		"@media": {
			"(prefers-reduced-motion: reduce)": {
				animationName: fadeOut,
				selectors: { "&[data-expanded]": { animationName: fadeIn } },
			},
		},
	};
}

const popIn = keyframes({ from: { opacity: 0, transform: "scale(0.96)" } });
const popOut = keyframes({ to: { opacity: 0, transform: "scale(0.98)" } });

/**
 * Inkstone "Pop" for popovers, menus, list popovers and tooltips: in from
 * `scale(0.96)` with a fade, out to `scale(0.98)` faster, growing from the
 * trigger side. Kobalte sets the origin on the popper wrapper.
 */
export function popAnimation(): StyleRule {
	return {
		transformOrigin: "var(--kb-popper-content-transform-origin)",
		...presenceAnimation({ enter: popIn, exit: popOut, fillMode: "forwards" }),
	};
}

/** `transition` value for the given properties with the kit ease-out. */
export const transition = (properties: string[], duration: string = tokens.motion.duration.fast) =>
	properties.map(property => `${property} ${duration} ${tokens.motion.ease.out}`).join(", ");
