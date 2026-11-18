import type { TableStyleOptions } from "../generated-appearance/table";
import * as styles from "../components/Table/Table.css";
export const tableParts = {
	root: "table",
	scrollArea: "table-scroll-area",
} as const;

export type TablePart = keyof typeof tableParts;
export type TableClasses = Partial<Record<TablePart, string>>;
export type TableVariants = Omit<TableStyleOptions, "class">;
export type TableSize = NonNullable<TableVariants["size"]>;

export type TableStyles = { [P in TablePart]: () => string };

export const tableStyles: TableStyles = {
	root: styles.root,
	scrollArea: styles.scrollArea,
};
