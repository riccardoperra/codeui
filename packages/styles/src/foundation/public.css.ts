import {
	globalStyle as emit,
	style as privateStyle,
	createGlobalThemeContract,
	type StyleRule,
	type ComplexStyleRule,
	type GlobalStyleRule,
} from "@vanilla-extract/css";
import { publicStylesRegistry } from "../registry";
import { recipe as privateRecipe } from "@vanilla-extract/recipes";

export const partSelector = (part: string) => ".cui-" + part;
const owners = (...parts: string[]) => ":is(" + parts.map(partSelector).join(",") + ")";
export const iconButtonOwner = owners(
	publicStylesRegistry.iconButton.parts.iconButton,
	publicStylesRegistry.dialog.parts.closeButton,
);
export const buttonOwner = owners(
	publicStylesRegistry.button.parts.button,
	publicStylesRegistry.iconButton.parts.iconButton,
	publicStylesRegistry.dialog.parts.closeButton,
);
const selectorFor = (part: string) =>
	part === publicStylesRegistry.button.parts.button
		? buttonOwner
		: part === publicStylesRegistry.iconButton.parts.iconButton
			? iconButtonOwner
			: partSelector(part);
const rules = new Map<string, ComplexStyleRule>();

const states: (() => void)[] = [];
const structural = new Map<string, string>();
function split(selector: string): string[] {
	let depth = 0,
		start = 0;
	const result: string[] = [];
	for (let i = 0; i < selector.length; i++) {
		if ("([".includes(selector[i])) depth++;
		if (")]".includes(selector[i])) depth--;
		if (selector[i] === "," && depth === 0) {
			result.push(selector.slice(start, i));
			start = i + 1;
		}
	}
	result.push(selector.slice(start));
	return result;
}
function zero(selector: string) {
	for (const [attribute, effective] of structural)
		selector = selector.split(attribute).join(effective);
	return split(selector)
		.map(s => {
			const pseudo = s.match(/::[\w-]+$/)?.[0] ?? "";
			return ":where(" + s.slice(0, s.length - pseudo.length) + ")" + pseudo;
		})
		.join(",");
}
function write(
	selector: string,
	rule: ComplexStyleRule | string,
	conditions: string[] = [],
) {
	if (typeof rule === "string") {
		const known = rules.get(rule);
		if (known) write(selector, known, conditions);
		return;
	}
	if (Array.isArray(rule)) {
		for (const child of rule) write(selector, child, conditions);
		return;
	}
	const declarations: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(rule)) {
		if (key === "selectors") {
			for (const [nested, child] of Object.entries(value)) {
				const run = () =>
					write(nested.replaceAll("&", selector), child as StyleRule, conditions);
				states.push(run);
			}
		} else if (key.startsWith("@")) {
			for (const [condition, child] of Object.entries(value))
				write(selector, child as StyleRule, [...conditions, key, condition]);
		} else if (key.startsWith(":")) {
			states.push(() => write(selector + key, value as StyleRule, conditions));
		} else declarations[key] = value;
	}
	if (!Object.keys(declarations).length) return;
	let output: unknown = declarations;
	for (let i = conditions.length - 2; i >= 0; i -= 2)
		output = { [conditions[i]]: { [conditions[i + 1]]: output } };
	emit(zero(selector), { "@layer": { "cui.components": output } } as GlobalStyleRule);
}
export function finish() {
	while (states.length) states.shift()!();
}
export function style(rule: ComplexStyleRule, debugId?: string, part?: string): string {
	if (!part) {
		// Internal descendants remain private, but still have zero specificity.
		const name = privateStyle({}, debugId);
		write("." + name, rule);
		rules.set(name, rule);
		return name;
	}
	const selector = selectorFor(part);
	const name = part.includes(" > ")
		? privateStyle({}, debugId)
		: partSelector(part).slice(1);
	rules.set(name, rule);
	write(selector, rule);
	return name;
}
export function globalStyle(selector: string, rule: GlobalStyleRule) {
	write(selector, rule);
}
export const recipe: typeof privateRecipe = (options, debugId) =>
	privateRecipe(options, debugId);
export function publicRecipe<
	Variants extends Record<string, Record<string, ComplexStyleRule | string>>,
>(options: Parameters<typeof privateRecipe<Variants>>[0], debugId: string, part: string) {
	const descriptor =
		part === publicStylesRegistry.button.parts.button
			? publicStylesRegistry.button
			: Object.values(publicStylesRegistry.switch.parts).some(value => value === part)
				? publicStylesRegistry.switch
				: publicStylesRegistry.dialog;
	const axes: Readonly<Record<string, readonly string[]>> = descriptor.variants;
	for (const [axis, definitions] of Object.entries(options.variants ?? {})) {
		const declared = axes[axis];
		if (
			!declared ||
			JSON.stringify(Object.keys(definitions).sort()) !==
				JSON.stringify([...declared].sort())
		)
			throw new Error("Registry variant mismatch: " + part + "/" + axis);
	}
	const selector = selectorFor(part);
	const variants = Object.fromEntries(
		Object.entries(options.variants ?? {}).map(([axis, values]) => [
			axis,
			Object.fromEntries(
				Object.keys(values).map(value => [
					value,
					privateStyle({}, debugId + "_" + axis + "_" + value),
				]),
			),
		]),
	);
	const effective = (axis: string, value: unknown) => {
		const attr =
			axis === "loading" && String(value) === "true"
				? "[data-loading]"
				: "[data-" + axis + '="' + value + '"]';
		const fallback = "." + variants[axis][String(value)] + ":not([data-" + axis + "])";
		const defaultValue = options.defaultVariants?.[axis];
		return (
			":is(" +
			attr +
			"," +
			fallback +
			(String(defaultValue) === String(value)
				? ",:not([data-" +
					axis +
					"])" +
					Object.values(variants[axis])
						.map(c => ":not(." + c + ")")
						.join("")
				: "") +
			")"
		);
	};
	if (part === publicStylesRegistry.dialog.parts.panel)
		for (const value of publicStylesRegistry.dialog.variants.chrome)
			structural.set(
				"[data-chrome=" + value + "]",
				selector + effective("chrome", value),
			);
	if (part === publicStylesRegistry.dialog.parts.section)
		for (const value of publicStylesRegistry.dialog.variants.variant)
			structural.set(
				"[data-variant=" + value + "]",
				selector + effective("variant", value),
			);
	write(selector, options.base ?? {});
	for (const [axis, values] of Object.entries(options.variants ?? {}))
		for (const [value, rule] of Object.entries(values))
			write(selector + effective(axis, value), rule);
	for (const compound of options.compoundVariants ?? [])
		write(
			selector +
				Object.entries(compound.variants)
					.map(([axis, value]) => effective(axis, value))
					.join(""),
			compound.style,
		);
	const base = partSelector(part).slice(1);

	return privateRecipe(
		{ ...options, base, variants: variants as Variants, compoundVariants: [] },
		debugId,
	);
}
export function createTheme<Defaults extends Record<string, string>>(
	defaults: Defaults,
	debugId: string,
	part: string,
) {
	const variables: Readonly<Record<string, string>> =
		part === publicStylesRegistry.button.parts.button
			? publicStylesRegistry.button.variables
			: publicStylesRegistry.dialog.variables;
	const vars = createGlobalThemeContract(
		Object.fromEntries(Object.keys(defaults).map(key => [key, null])) as {
			[Key in keyof Defaults]: null;
		},
		(_, path) => variables[path[0]].slice(2),
	);
	const assignments = Object.fromEntries(
		Object.keys(defaults).map(key => [vars[key as keyof Defaults], defaults[key]]),
	);
	const name = privateStyle({}, debugId);
	rules.set(name, { vars: assignments });
	write(
		":is(" +
			(part === publicStylesRegistry.dialog.parts.panel
				? [
						publicStylesRegistry.dialog.parts.panel,
						publicStylesRegistry.dialog.parts.positioner,
						publicStylesRegistry.dialog.parts.overlay,
					]
						.map(partSelector)
						.join(",")
				: selectorFor(part)) +
			",." +
			name +
			")",
		{ vars: assignments },
	);
	return [name, vars] as [string, typeof vars];
}
