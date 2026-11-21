import "@codeui/styles/theme.css";
import "@codeui/styles/table.css";
import { omit } from "solid-js";
import { type ComponentProps } from "@solidjs/web";
import {
	tableParts,
	tableStyleProps,
	type TableClasses,
	type TableVariants,
} from "@codeui/styles/table";
import { mergeClasses } from "../../utils/css";
import * as styles from "./Table.css";

const defaultTableSize = tableStyleProps()["data-size"];

export {
	tableParts,
	tableStyles,
	type TablePart,
	type TableClasses,
	type TableSize,
	type TableVariants,
	type TableStyles,
} from "@codeui/styles/table";

export type TableProps = ComponentProps<"table"> &
	TableVariants & {
		/** Classes for the parts this component renders, keyed by part name. */
		classes?: Pick<TableClasses, "root">;
	};

/**
 * A native `table`. Write `caption`, `thead`, `tbody`, `tfoot`, `tr`, `th` and `td`
 * as children; the styles reach them without wrappers and stop at nested tables.
 */
export function Table(props: TableProps) {
	const others = omit(props, "class", "classes", "size", "striped");
	return (
		<table
			{...others}
			data-cui={tableParts.root}
			data-size={props.size ?? defaultTableSize}
			data-striped={props.striped || undefined}
			class={mergeClasses(styles.root(), props.classes?.root, props.class)}
		/>
	);
}

export type TableScrollAreaProps = ComponentProps<"div"> & {
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: Pick<TableClasses, "scrollArea">;
};

/**
 * Scrolls a wide table sideways inside its own box. Name it with `aria-label` or
 * `aria-labelledby` to make it a focusable region the keyboard can scroll.
 */
export function TableScrollArea(props: TableScrollAreaProps) {
	const others = omit(props, "class", "classes");
	const named = () => Boolean(others["aria-label"] || others["aria-labelledby"]);
	return (
		<div
			role={named() ? "region" : undefined}
			tabindex={named() ? 0 : undefined}
			{...others}
			data-cui={tableParts.scrollArea}
			class={mergeClasses(styles.scrollArea(), props.classes?.scrollArea, props.class)}
		/>
	);
}
