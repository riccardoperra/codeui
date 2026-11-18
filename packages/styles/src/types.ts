import type * as CSS from "csstype";

type CSSVariable = `var(--${string})`;
type StandardProperties = CSS.Properties<number | (string & {})>;
type Properties = {
	[Property in keyof StandardProperties]:
		| StandardProperties[Property]
		| CSSVariable
		| Array<CSSVariable | StandardProperties[Property]>;
};
type PropertiesWithVars = Properties & {
	vars?: Record<string, string>;
};
type WithQueries<Rule> = Rule & {
	"@media"?: Record<string, WithQueries<Rule>>;
	"@supports"?: Record<string, WithQueries<Rule>>;
	"@layer"?: Record<string, WithQueries<Rule>>;
	"@container"?: Record<string, WithQueries<Rule>>;
	"@scope"?: Record<string, WithQueries<Rule>>;
	"@starting-style"?: Rule;
};
export type StyleRule = WithQueries<
	PropertiesWithVars & {
		[Pseudo in CSS.SimplePseudos]?: PropertiesWithVars;
	} & {
		selectors?: Record<string, WithQueries<PropertiesWithVars>>;
	}
>;
