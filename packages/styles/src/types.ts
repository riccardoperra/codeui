import type * as CSS from "csstype";

type BooleanKey<T> = T extends "true" | "false" ? boolean : T;
type VariantSelection<Variants> = {
	[Group in keyof Variants]?: BooleanKey<keyof Variants[Group]>;
};
export type RuntimeFn<Variants> = ((options?: VariantSelection<Variants>) => string) & {
	variants(): (keyof Variants)[];
	classNames: {
		base: string;
		variants: { [Group in keyof Variants]: { [Value in keyof Variants[Group]]: string } };
	};
};
export type RecipeVariants<Fn extends (...args: never[]) => string> = Parameters<Fn>[0];
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
