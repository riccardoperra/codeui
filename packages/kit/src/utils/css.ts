export { mergeClasses, toPx } from "@codeui/styles/internal/utils/css";

export function assignInlineVars(vars: Record<string, string>) {
	return Object.fromEntries(
		Object.entries(vars).map(([variable, value]) => [
			variable.replace(/^var\((--[^)]+)\)$/, "$1"),
			value,
		]),
	);
}
