/** `var(--name)` to `--name`, so a token reference can be set as an inline custom property. */
export function cssVarName(reference: `var(--${string})`): `--${string}` {
	return reference.slice(4, -1) as `--${string}`;
}

/** The empty attribute that Inkstone selectors such as `[data-checked]` match. */
export function flag(on: boolean | undefined): "" | undefined {
	return on ? "" : undefined;
}
