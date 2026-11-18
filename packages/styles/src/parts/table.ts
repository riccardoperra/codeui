import * as styles from "../components/Table/Table.css";
export const tableParts = {
	root: "table-root",
	scrollArea: "table-scroll-area",
} as const;

export type TablePart = keyof typeof tableParts;
export type TableClasses = Partial<Record<TablePart, string>>;
export type TableSize = "sm" | "md";
export type TableVariants = { size?: TableSize; striped?: boolean };

export type TableStyles = { [P in TablePart]: () => string };

export const tableStyles: TableStyles = {
	root: styles.root,
	scrollArea: styles.scrollArea,
};
