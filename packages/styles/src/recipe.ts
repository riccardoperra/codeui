import type { RuntimeFn, VariantSelection } from "./types";

export function recipe<Variants extends Record<string, Record<string, string>>>(config: {
	defaultClassName: string;
	variantClassNames: Variants;
	defaultVariants: VariantSelection<Variants>;
}): RuntimeFn<Variants> {
	const defaults = config.defaultVariants;
	const variants: Record<string, Record<string, string>> = config.variantClassNames;
	return Object.assign(
		(options?: VariantSelection<Variants>) => {
			const selections = { ...defaults, ...options };
			const classes = [config.defaultClassName];
			for (const key of Object.keys(selections) as (keyof Variants & string)[]) {
				const value = selections[key] ?? defaults[key];
				if (value == null) continue;
				const group = variants[key];
				const name = group && Object.hasOwn(group, String(value)) && group[String(value)];
				if (name) classes.push(name);
			}
			return classes.join(" ");
		},
		{
			variants: () => Object.keys(variants),
			classNames: {
				base: config.defaultClassName.split(" ")[0],
				variants: Object.fromEntries(
					Object.entries(variants).map(([group, choices]) => [
						group,
						Object.fromEntries(
							Object.entries(choices).map(([value, name]) => [value, name.split(" ")[0]]),
						),
					]),
				),
			},
		},
	) as RuntimeFn<Variants>;
}
