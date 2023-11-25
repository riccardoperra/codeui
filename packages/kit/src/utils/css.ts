export function mergeClasses(...classNames: Array<string | null | undefined>) {
	return classNames.filter(Boolean).join(" ");
}

export function toPx(value: number) {
	return `${value}px`;
}
