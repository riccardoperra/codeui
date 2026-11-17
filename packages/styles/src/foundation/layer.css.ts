import {
	ComplexStyleRule,
	createGlobalThemeContract,
	globalLayer,
	globalStyle as veGlobalStyle,
	GlobalStyleRule,
	style as veStyle,
	StyleRule,
	styleVariants as veStyleVariants,
} from "@vanilla-extract/css";
import { recipe as veRecipe } from "@vanilla-extract/recipes";

/**
 * Every kit rule lives in this cascade layer, so unlayered app CSS wins
 * over kit styles whatever the stylesheet order.
 */
export const cuiLayer = globalLayer("cui");
globalLayer("cui.tokens");
globalLayer("cui.base");
globalLayer("cui.components");
type Priority = "tokens" | "base" | "components";

function inLayer(rule: StyleRule, priority: Priority = "components"): StyleRule {
	return { "@layer": { [`cui.${priority}`]: rule } };
}

function layerComplex<T extends ComplexStyleRule | string>(
	rule: T,
	priority: Priority = "components",
): T {
	if (typeof rule === "string") return rule;
	if (Array.isArray(rule)) {
		return rule.map(item =>
			typeof item === "string" || Array.isArray(item) ? item : inLayer(item, priority),
		) as T;
	}
	return inLayer(rule as StyleRule, priority) as T;
}

export function style(
	rule: ComplexStyleRule,
	debugId?: string,
	priority: Priority = "components",
): string {
	return veStyle(layerComplex(rule, priority), debugId);
}

export function globalStyle(selector: string, rule: GlobalStyleRule, priority: Priority = "components"): void {
	veGlobalStyle(selector, { "@layer": { ["cui." + priority]: rule } });
}

export function styleVariants<Data extends Record<string | number, unknown>>(
	data: Data,
	mapData: (value: Data[keyof Data], key: keyof Data) => ComplexStyleRule,
	debugId?: string,
): Record<keyof Data, string> {
	return veStyleVariants(
		data,
		(value, key) => layerComplex(mapData(value, key)),
		debugId,
	);
}

export const recipe: typeof veRecipe = (options, debugId) => {
	const variants = options.variants
		? Object.fromEntries(
				Object.entries(options.variants).map(([group, definitions]) => [
					group,
					Object.fromEntries(
						Object.entries(definitions).map(([name, rule]) => [name, layerComplex(rule)]),
					),
				]),
			)
		: undefined;
	return veRecipe(
		{
			...options,
			base: layerComplex(
				options.base === undefined
					? {}
					: typeof options.base === "string"
						? [options.base]
						: options.base,
			),
			variants: variants as typeof options.variants,
			compoundVariants: options.compoundVariants?.map(compound => ({
				...compound,
				style:
					typeof compound.style === "string"
						? compound.style
						: veStyle(
								layerComplex(compound.style),
								`${debugId}_compound_${Object.entries(compound.variants)
									.sort(([a], [b]) => a.localeCompare(b))
									.map(([key, value]) => `${key}_${value}`)
									.join("_")}`,
							),
			})),
		},
		debugId,
	);
};

/**
 * Layered replacement for vanilla-extract `createTheme`: a class that sets
 * component-local variables, so app CSS can still override them.
 */
export function createTheme<Defaults extends Record<string, string>>(
	defaults: Defaults,
	debugId?: string,
) {
	const vars = createGlobalThemeContract(
		Object.fromEntries(Object.keys(defaults).map(key => [key, null])) as {
			[Key in keyof Defaults]: null;
		},
		(_, path) => `cui-${debugId}-${path.join("-")}`,
	);
	const assignments = Object.fromEntries(
		Object.keys(defaults).map(key => [vars[key as keyof Defaults], defaults[key]]),
	);
	const className = style({ vars: assignments }, debugId);
	return [className, vars] as [string, typeof vars];
}
