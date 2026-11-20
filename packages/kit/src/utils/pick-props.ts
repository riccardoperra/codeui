import { omit } from "solid-js";

/** Forward a subset of props through Solid's reactive prop view. */
export function pickProps<Props extends object, Key extends keyof Props>(
	props: Props,
	...keys: Key[]
): Pick<Props, Key> {
	const forwarded = new Set<PropertyKey>(keys);
	return omit(props, key => !forwarded.has(key)) as Pick<Props, Key>;
}
