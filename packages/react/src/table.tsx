import {
	tableStyleProps,
	tableStyles,
	tableParts,
	type TableVariants,
} from "@codeui/styles/table";
import type { ComponentProps } from "react";
import { classes } from "./classes";

export type TableProps = ComponentProps<"table"> & TableVariants;

export function Table({ className, size, striped, ...props }: TableProps) {
	const { class: styledClass, ...appearance } = tableStyleProps({
		size,
		striped,
		class: className,
	});
	return <table {...props} {...appearance} className={styledClass} />;
}

export type TableScrollAreaProps = ComponentProps<"div">;

export function TableScrollArea({ className, ...props }: TableScrollAreaProps) {
	const named = Boolean(props["aria-label"] || props["aria-labelledby"]);

	return (
		<div
			role={named ? "region" : undefined}
			tabIndex={named ? 0 : undefined}
			{...props}
			className={classes(tableStyles.scrollArea(), className)}
			data-cui={tableParts.scrollArea}
		/>
	);
}
