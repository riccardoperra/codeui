import { createGlobalThemeContract, type GlobalStyleRule } from "@vanilla-extract/css";
import { globalStyle } from "./layer.css";
import { derivedBrand, derivedRadius, relativeColorSupport } from "./derived";
import { themeValues } from "./theme-values";

type Mode = "dark" | "light";
type ModeValues = { readonly dark: string; readonly light: string };
type Registry = { readonly [key: string]: string | ModeValues | Registry };

type ContractShape<T> = {
	-readonly [Key in keyof T]: T[Key] extends string | ModeValues
		? null
		: ContractShape<T[Key]>;
};

const isModeValues = (value: Registry[string]): value is ModeValues =>
	typeof value === "object" &&
	typeof value.dark === "string" &&
	typeof value.light === "string";

function contractShape<T extends Registry>(registry: T): ContractShape<T> {
	return Object.fromEntries(
		Object.entries(registry).map(([key, value]) => [
			key,
			typeof value === "string" || isModeValues(value) ? null : contractShape(value),
		]),
	) as ContractShape<T>;
}

/** `["space", "1.5"]` → `cui-space-1-5`, `["font", "lineHeight"]` → `cui-font-line-height`. */
const cssVariableName = (path: ReadonlyArray<string>) =>
	["cui", ...path]
		.map(segment =>
			segment
				.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
				.replace(/\./g, "-")
				.toLowerCase(),
		)
		.join("-");

/**
 * The kit design tokens. Every leaf is `var(--cui-…)`, a stable name that
 * apps can override with plain CSS.
 */
export const tokens = createGlobalThemeContract(contractShape(themeValues), (_, path) =>
	cssVariableName(path),
);

/**
 * A token is scoped when its value differs by mode or refers to another token.
 * Only scoped tokens are set again on each `[data-cui-theme]` scope. The rest
 * are set once on `:root`, so an app override on `:root` reaches every scope.
 */
const isScoped = (value: string | ModeValues) =>
	typeof value !== "string" || value.includes("var(");

function modeAssignments(mode: Mode, scopedOnly: boolean): Record<string, string> {
	const assignments: Record<string, string> = {};
	const visit = (registry: Registry, path: string[]) => {
		for (const [key, value] of Object.entries(registry)) {
			if (typeof value === "string" || isModeValues(value)) {
				if (scopedOnly && !isScoped(value)) continue;
				assignments[`--${cssVariableName([...path, key])}`] =
					typeof value === "string" ? value : value[mode];
			} else {
				visit(value, [...path, key]);
			}
		}
	};
	visit(themeValues, []);
	return { ...assignments, ...derivedRadius(cssVariableName) };
}

const light = modeAssignments("light", true);
const dark = modeAssignments("dark", true);

globalStyle(":root", { vars: modeAssignments("light", false), colorScheme: "light" });
globalStyle(":root:not([data-cui-theme=light])", {
	"@media": { "(prefers-color-scheme: dark)": { vars: dark, colorScheme: "dark" } },
});
globalStyle("[data-cui-theme=dark]", { vars: dark, colorScheme: "dark" });
globalStyle("[data-cui-theme=light]", { vars: light, colorScheme: "light" });

const brand = {
	dark: derivedBrand("dark", cssVariableName),
	light: derivedBrand("light", cssVariableName),
};
const whenRelativeColor = (rule: GlobalStyleRule): GlobalStyleRule => ({
	"@supports": { [relativeColorSupport]: rule },
});

globalStyle(":root", whenRelativeColor({ vars: brand.light }));
globalStyle(
	":root:not([data-cui-theme=light])",
	whenRelativeColor({
		"@media": { "(prefers-color-scheme: dark)": { vars: brand.dark } },
	}),
);
globalStyle("[data-cui-theme=dark]", whenRelativeColor({ vars: brand.dark }));
globalStyle("[data-cui-theme=light]", whenRelativeColor({ vars: brand.light }));
