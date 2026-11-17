import { mergeClasses } from "../utils/css";
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
export type AccordionVariants = { density?: "compact" | "comfortable" };
export type AccordionStyles = Record<
	AccordionPart,
	(variants?: AccordionVariants) => string
>;
export const accordionStyles: AccordionStyles = {
	root: () => styles.root,
	item: () => styles.item,
	header: () => styles.header,
	trigger: variants => styles.trigger({ density: variants?.density }),
	content: () => styles.content,
	icon: () => styles.icon,
	title: () => styles.title,
	summary: () => styles.summary,
	chevron: () => styles.chevron,
};
