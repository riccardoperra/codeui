import {
	ComplexStyleRule,
	createThemeContract,
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

function inLayer(rule: StyleRule): StyleRule {
	return { "@layer": { [cuiLayer]: rule } };
}

function layerComplex<T extends ComplexStyleRule | string>(rule: T): T {
	if (typeof rule === "string") return rule;
	if (Array.isArray(rule)) {
		return rule.map(item =>
			typeof item === "string" || Array.isArray(item) ? item : inLayer(item),
		) as T;
	}
	return inLayer(rule as StyleRule) as T;
}

export function style(rule: ComplexStyleRule, debugId?: string): string {
	return veStyle(layerComplex(rule), debugId);
}

export function globalStyle(selector: string, rule: GlobalStyleRule): void {
	veGlobalStyle(selector, { "@layer": { [cuiLayer]: rule } });
}

export function styleVariants<Data extends Record<string | number, unknown>>(
	data: Data,
	mapData: (value: Data[keyof Data], key: keyof Data) => ComplexStyleRule,
	debugId?: string,
): Record<keyof Data, string> {
	return veStyleVariants(data, (value, key) => layerComplex(mapData(value, key)), debugId);
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
			base: options.base === undefined ? undefined : layerComplex(options.base),
			variants: variants as typeof options.variants,
			compoundVariants: options.compoundVariants?.map(compound => ({
				...compound,
				style: layerComplex(compound.style),
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
	const vars = createThemeContract(
		Object.fromEntries(Object.keys(defaults).map(key => [key, null])) as {
			[Key in keyof Defaults]: null;
		},
	);
	const assignments = Object.fromEntries(
		Object.keys(defaults).map(key => [vars[key as keyof Defaults], defaults[key]]),
	);
	const className = style({ vars: assignments }, debugId);
	return [className, vars] as [string, typeof vars];
}
