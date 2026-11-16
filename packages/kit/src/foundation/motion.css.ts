import { keyframes, StyleRule } from "@vanilla-extract/css";
import { tokens } from "./cui.css";

const fadeIn = keyframes({ from: { opacity: 0 } });
const fadeOut = keyframes({ to: { opacity: 0 } });

/**
 * Enter and exit animation for an overlay that Kobalte marks with
 * `data-expanded`. Reduced motion keeps only a fade.
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
		},
		"@media": {
			"(prefers-reduced-motion: reduce)": {
				animationName: fadeOut,
				selectors: { "&[data-expanded]": { animationName: fadeIn } },
			},
		},
	};
}

/** `transition` value for the given properties with the kit ease-out. */
export const transition = (properties: string[], duration: string = tokens.motion.duration.fast) =>
	properties.map(property => `${property} ${duration} ${tokens.motion.ease.out}`).join(", ");
