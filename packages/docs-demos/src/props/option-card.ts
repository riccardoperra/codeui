import type { OptionCardGroupProps, OptionCardProps } from "@codeui/kit";
import type * as P from "@codeui/kit/option-card/parts";
import type { PropNotes } from "./notes";

export type OptionCardGroup = Pick<OptionCardGroupProps, "items" | "value" | "defaultValue" | "onChange" | "label" | "description" | "errorMessage" | "classes" | "variant" | "class">;
export type OptionCardGroupInherited = Pick<OptionCardGroupProps, "disabled" | "readOnly" | "required" | "validationState" | "orientation" | "name" | "id">;
export type OptionCard = Pick<OptionCardProps, "value" | "label" | "description" | "preview" | "badge" | "disabled" | "variant" | "class" | "classes">;
export type Root = Pick<P.RootProps, "variant" | "class">;
export type Label = Pick<P.LabelProps, "variant" | "class">;
export type Description = Pick<P.DescriptionProps, "variant" | "class">;
export type ErrorMessage = Pick<P.ErrorMessageProps, "variant" | "class">;
export type Item = Pick<P.ItemProps, "variant" | "class">;
export type ItemInput = Pick<P.ItemInputProps, "variant" | "class">;
export type ItemControl = Pick<P.ItemControlProps, "variant" | "class">;
export type ItemIndicator = Pick<P.ItemIndicatorProps, "variant" | "class">;
export type ItemLabel = Pick<P.ItemLabelProps, "variant" | "class">;
export type ItemDescription = Pick<P.ItemDescriptionProps, "variant" | "class">;
export type RootInherited = Pick<P.RootProps, "value" | "defaultValue" | "onChange" | "disabled" | "readOnly" | "required" | "validationState" | "orientation" | "name">;
export type ItemInherited = Pick<P.ItemProps, "value" | "disabled">;
export type ItemIndicatorInherited = Pick<P.ItemIndicatorProps, "forceMount">;
export type ErrorMessageInherited = Pick<P.ErrorMessageProps, "forceMount">;
export type Preview = Pick<P.PreviewProps, "class" | "children">;
export type OptionCardBadge = Pick<P.BadgeProps, "tone" | "size" | "variant" | "icon" | "classes" | "class">;
export type OptionCardBadgeInherited = Pick<P.BadgeProps, "textValue">;
export const notes = {
	OptionCardGroup: {
		items: { description: "Entries with a value, label, and optional preview, badge, description, or disabled state." },
		value: { description: "Controlled selected value." },
		defaultValue: { description: "Initial selected value in uncontrolled mode." },
		onChange: { description: "Called with the selected entry value." },
		label: { description: "Accessible group title." },
		description: { description: "Supporting text connected to the group." },
		errorMessage: { description: "Message displayed when validationState is invalid." },
		classes: { description: "Classes keyed by option-card anatomy part." },
		variant: { default: '"card"', description: "Card spacing or compact tile spacing. Parts set their own variant." }, class: { description: "Class merged after the kit styles." } },
	OptionCard: {
		value: { description: "Unique radio value within the parent group." },
		label: { description: "Visible card title and radio label." },
		description: { description: "Supporting text connected to the radio." },
		preview: { description: "Decorative content above the title." },
		badge: { description: "Status text such as Default, independent of selection." },
		disabled: { default: "false", description: "Prevents this item from being selected." },
		classes: { description: "Classes merged with any ready-group part classes." },
		variant: { default: '"card"', description: "Card spacing or compact tile spacing. Parts set their own variant." }, class: { description: "Class merged after the kit styles." } },
	Root: { variant: { default: '"card"', description: "Card spacing or compact tile spacing. Parts set their own variant." }, class: { description: "Class merged after the kit styles." } },
	Label: { variant: { default: '"card"', description: "Card spacing or compact tile spacing. Parts set their own variant." }, class: { description: "Class merged after the kit styles." } },
	Description: { variant: { default: '"card"', description: "Card spacing or compact tile spacing. Parts set their own variant." }, class: { description: "Class merged after the kit styles." } },
	ErrorMessage: { variant: { default: '"card"', description: "Card spacing or compact tile spacing. Parts set their own variant." }, class: { description: "Class merged after the kit styles." } },
	Item: { variant: { default: '"card"', description: "Card spacing or compact tile spacing. Parts set their own variant." }, class: { description: "Class merged after the kit styles." } },
	ItemInput: { variant: { default: '"card"', description: "Card spacing or compact tile spacing. Parts set their own variant." }, class: { description: "Class merged after the kit styles." } },
	ItemControl: { variant: { default: '"card"', description: "Card spacing or compact tile spacing. Parts set their own variant." }, class: { description: "Class merged after the kit styles." } },
	ItemIndicator: { variant: { default: '"card"', description: "Card spacing or compact tile spacing. Parts set their own variant." }, class: { description: "Class merged after the kit styles." } },
	ItemLabel: { variant: { default: '"card"', description: "Card spacing or compact tile spacing. Parts set their own variant." }, class: { description: "Class merged after the kit styles." } },
	ItemDescription: { variant: { default: '"card"', description: "Card spacing or compact tile spacing. Parts set their own variant." }, class: { description: "Class merged after the kit styles." } },
	OptionCardGroupInherited: { orientation: { default: '"horizontal"', description: "Horizontal responsive grid or vertical single column." }, disabled: { default: "false", description: "Disables every option." }, readOnly: { default: "false", description: "Prevents changes to the value." }, required: { default: "false", description: "Requires a selection for form submission." } },
	OptionCardBadge: { tone: { default: '"neutral"', description: "Badge colour." }, size: { default: '"sm"', description: "Badge size." }, variant: { default: '"soft"', description: "Badge appearance, separate from the card variant." } },
} satisfies PropNotes;
