export function mergeClasses(...classNames: Array<string | null | undefined>) {
	return classNames.filter(Boolean).join(" ");
}
