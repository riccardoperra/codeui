import type { RuntimeFn } from "../types";

/** The private classes are frozen compatibility identifiers, not public parts. */
export function recipe<V>(
	classNames: RuntimeFn<V>["classNames"],
	defaults: Record<string, string>,
	part: string,
): RuntimeFn<V> {
	const select = (options: Record<string, unknown> = {}) => {
		const classes = [classNames.base, part];
		for (const [axis, values] of Object.entries<Record<string, string>>(
			classNames.variants,
		)) {
			const value = options[axis] ?? defaults[axis];
			if (value !== undefined && values[String(value)])
				classes.push(values[String(value)]);
		}
		return classes.join(" ");
	};
	return Object.assign(select, {
		classNames,
		variants: () => Object.keys(classNames.variants) as (keyof V)[],
	});
}
