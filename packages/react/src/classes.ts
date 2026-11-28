export function classes(...values: (string | false | null | undefined)[]): string {
	return values.filter(Boolean).join(" ");
}
