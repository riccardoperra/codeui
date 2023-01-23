import type { StyleRule } from "@vanilla-extract/css";
import { breakpoints } from "./breakpoints";
import { mapValues, omit } from "../utils/object";

type CSSProps = Omit<StyleRule, "@media" | "@supports">;

const allowedBreakpoints = omit(breakpoints, ["xs"]);

export const breakpointQuery = mapValues(
	allowedBreakpoints,
	bp => `screen and (min-width: ${bp}px)`,
);

const makeMediaQuery =
	(breakpoint: keyof typeof breakpointQuery) => (styles?: CSSProps) =>
		!styles || Object.keys(styles).length === 0
			? {}
			: {
					[breakpointQuery[breakpoint]]: styles,
			  };

const mediaQuery = {
	sm: makeMediaQuery("sm"),
	md: makeMediaQuery("md"),
	lg: makeMediaQuery("lg"),
	xl: makeMediaQuery("xl"),
	"2xl": makeMediaQuery("2xl"),
};

interface ResponsiveStyle {
	xs?: CSSProps;
	sm?: CSSProps;
	md?: CSSProps;
	lg?: CSSProps;
	xl?: CSSProps;
	"2xl"?: CSSProps;
}

export const responsiveStyle = (style: ResponsiveStyle): StyleRule => ({
	...omit(style.xs as StyleRule, ["@media"]),
	...(style.sm || style.md || style.lg || style.xl || style["2xl"]
		? {
				"@media": {
					...mediaQuery.sm(style.sm ?? {}),
					...mediaQuery.md(style.md ?? {}),
					...mediaQuery.lg(style.lg ?? {}),
					...mediaQuery.xl(style.xl ?? {}),
					...mediaQuery["2xl"](style["2xl"] ?? {}),
				},
		  }
		: {}),
});
