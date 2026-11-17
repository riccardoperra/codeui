import * as styles from "../components/Sheet/Sheet.css";
export const sheetParts = {
	trigger: "sheet-trigger",
	overlay: "sheet-overlay",
	content: "sheet-content",
	header: "sheet-header",
	title: "sheet-title",
	description: "sheet-description",
	closeButton: "sheet-close-button",
	handle: "sheet-handle",
	body: "sheet-body",
	footer: "sheet-footer",
} as const;

export type SheetPart = keyof typeof sheetParts;
export type SheetClasses = Partial<Record<SheetPart, string>>;
export type SheetSide = "bottom" | "left" | "right";
/** `auto` slides on pointer opens and closes. `none` never moves. */
export type SheetMotion = "auto" | "none";

export type SheetStyles = {
	[P in SheetPart]: () => string;
};

export const sheetStyles: SheetStyles = {
	trigger: () => "",
	overlay: () => styles.overlay,
	content: styles.content,
	header: () => styles.header,
	title: () => styles.title,
	description: () => styles.description,
	closeButton: () => styles.closeButton,
	handle: () => styles.handle,
	body: () => styles.body,
	footer: () => styles.footer,
};
