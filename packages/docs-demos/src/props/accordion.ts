import type { AccordionProps } from "@codeui/kit";
import type * as Parts from "@codeui/kit/accordion";
import type { ComponentProps } from "solid-js";
import type { PropNotes } from "./notes";

export type Accordion = Pick<AccordionProps, "items" | "value" | "defaultValue" | "onChange" | "collapsible" | "keepMounted" | "motion" | "class" | "classes" | "aria-label">;
export type AccordionRoot = Pick<ComponentProps<typeof Parts.Root>, "motion" | "class">;
export type AccordionRootInherited = Pick<Parts.RootProps, "value" | "defaultValue" | "onChange" | "multiple" | "collapsible" | "shouldFocusWrap">;
export type AccordionItem = Pick<ComponentProps<typeof Parts.Item>, "class">;
export type AccordionItemInherited = Pick<Parts.ItemProps, "value" | "disabled" | "forceMount">;
export type AccordionHeader = Pick<ComponentProps<typeof Parts.Header>, "class">;
export type AccordionTrigger = Pick<ComponentProps<typeof Parts.Trigger>, "class">;
export type AccordionTriggerInherited = Pick<Parts.TriggerProps, "disabled">;
export type AccordionContent = Pick<ComponentProps<typeof Parts.Content>, "class">;
export type AccordionIcon = Pick<Parts.IconProps, "class">;
export type AccordionTitle = Pick<Parts.TitleProps, "class">;
export type AccordionSummary = Pick<Parts.SummaryProps, "class">;
export type AccordionChevron = Pick<Parts.ChevronProps, "class">;

export const notes = {
	AccordionRootInherited: {
		value: { description: "Controlled array of expanded item values." },
		defaultValue: { default: "[]", description: "Initial expanded item values." },
		onChange: { description: "Receives the expanded item values." },
		multiple: { default: "false", description: "Allows several expanded sections." },
		collapsible: { default: "false", description: "Allows the selected item to close in single mode. The ready component defaults to true." },
		shouldFocusWrap: { default: "true", description: "Wraps keyboard focus at either end of the headers." },
	},
	AccordionItemInherited: {
		value: { description: "Unique section identifier." },
		disabled: { default: "false", description: "Prevents the section from opening." },
		forceMount: { default: "false", description: "Retains collapsed content in the DOM." },
	},
	AccordionTriggerInherited: {
		disabled: { default: "false", description: "Disables the trigger." },
	},
	Accordion: {
		"items": { description: 'Sections with a unique value, title, content, and optional icon, summary, and disabled state.' },
		"value": { description: 'Controlled open section. Null closes all sections.' },
		"defaultValue": { default: 'null', description: 'Initial open section. No section opens by default.' },
		"onChange": { description: 'Receives the selected section or null.' },
		"collapsible": { default: 'true', description: 'Allows the open section to close.' },
		"keepMounted": { default: 'false', description: 'Retains collapsed content in the DOM.' },
		"motion": { default: '"auto"', description: 'Animates pointer actions. Keyboard actions remain instant.' },
		"class": { description: 'Class merged after the kit styles.' },
		"classes": { description: 'Classes keyed by the names in the anatomy table.' },
		"aria-label": { description: 'Accessible name.' },
	},
	AccordionRoot: {
		"motion": { default: '"auto"', description: 'Animates pointer actions. Keyboard actions remain instant.' },
		"class": { description: 'Class merged after the kit styles.' },
	},
	AccordionItem: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	AccordionHeader: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	AccordionTrigger: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	AccordionContent: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	AccordionIcon: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	AccordionTitle: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	AccordionSummary: {
		"class": { description: 'Class merged after the kit styles.' },
	},
	AccordionChevron: {
		"class": { description: 'Class merged after the kit styles.' },
	},
} satisfies PropNotes;
