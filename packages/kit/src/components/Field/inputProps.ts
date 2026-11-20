import { JSX } from "@solidjs/web";

export const INPUT_KEYS = [
	"aria-label",
	"aria-labelledby",
	"aria-describedby",
	"aria-details",
	"aria-autocomplete",
	"aria-controls",
	"aria-activedescendant",
	"aria-expanded",
	"aria-haspopup",
	"aria-keyshortcuts",
	"aria-invalid",
	"aria-required",
	"aria-busy",
	"aria-disabled",
	"aria-hidden",
	"aria-errormessage",
	"aria-live",
	"aria-atomic",
	"aria-relevant",
	"aria-roledescription",
	"aria-description",
	"aria-owns",
	"aria-flowto",
	"aria-current",
	"aria-pressed",
	"aria-checked",
	"aria-selected",
	"aria-multiline",
	"aria-multiselectable",
	"aria-orientation",
	"aria-readonly",
	"aria-placeholder",
	"aria-valuemin",
	"aria-valuemax",
	"aria-valuenow",
	"aria-valuetext",
	"aria-posinset",
	"aria-setsize",
	"aria-level",
	"aria-modal",
	"aria-sort",
	"aria-rowcount",
	"aria-rowindex",
	"aria-rowspan",
	"aria-colcount",
	"aria-colindex",
	"aria-colspan",

	"autocomplete",
	"inputmode",
	"enterkeyhint",
	"spellcheck",
	"type",
	"maxlength",
	"minlength",
	"pattern",
	"autofocus",
] as const;

export type FieldInputProps = {
	[Key in (typeof INPUT_KEYS)[number]]?: Key extends
		| "aria-describedby"
		| "aria-label"
		| "aria-labelledby"
		? string
		: JSX.InputHTMLAttributes<HTMLInputElement>[Key];
};
export type FieldClasses = Partial<
	Record<"root" | "input" | "label" | "description" | "errorMessage", string>
>;
