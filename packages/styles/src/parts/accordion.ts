import type { AccordionStyleOptions } from "../generated-appearance/accordion";
import * as styles from "../components/Accordion/Accordion.css";
export const accordionParts = {
	root: "accordion-root",
	item: "accordion-item",
	header: "accordion-header",
	trigger: "accordion-trigger",
	content: "accordion-content",
	icon: "accordion-icon",
	title: "accordion-title",
	summary: "accordion-summary",
	chevron: "accordion-chevron",
} as const;
export type AccordionPart = keyof typeof accordionParts;
export type AccordionClasses = Partial<Record<AccordionPart, string>>;
export type AccordionVariants = Omit<AccordionStyleOptions, "class">;
export type AccordionStyles = Record<
	AccordionPart,
	() => string
>;
export const accordionStyles: AccordionStyles = {
	root: () => styles.root,
	item: () => styles.item,
	header: () => styles.header,
	trigger: styles.trigger,
	content: () => styles.content,
	icon: () => styles.icon,
	title: () => styles.title,
	summary: () => styles.summary,
	chevron: () => styles.chevron,
};
