import { createPagination, PaginationOptions } from "@solid-primitives/pagination";
import { createEffect, For, mergeProps, on } from "solid-js";
import { NextIcon } from "../../icons/NextIcon";
import { PreviousIcon } from "../../icons/PreviousIcon";
import { IconButton } from "../IconButton/IconButton";
import * as styles from "./Pagination.css";

type PaginationItemSize = "xs" | "sm" | "md" | "lg" | "xl";

interface PaginationProps extends PaginationOptions {
	rounded?: boolean;
	page?: number;
	size?: PaginationItemSize;
	onChange?: (page: number) => void;
}

export function Pagination(props: PaginationProps) {
	props = mergeProps(
		{
			prevContent: <PreviousIcon class={styles.paginationIcon} />,
			nextContent: <NextIcon class={styles.paginationIcon} />,
			showLast: false,
			showFirst: false,
			maxPages: 5,
			showNext: true,
			showPrev: true,
			initialPage: props.page || props.initialPage || 1,
		} as Partial<PaginationOptions>,
		{ size: "md" as const, rounded: false },
		props,
	);

	const [paginationProps, page, setPage] = createPagination(props);

	createEffect(
		on(
			() => props.page,
			currentPage => currentPage && setPage(currentPage),
			{ defer: true },
		),
	);

	createEffect(on(page, page => props.onChange?.(page), { defer: true }));

	const getAriaLabel = (currentPage: number | undefined) => {
		if (!currentPage) return undefined;
		const label = `Page ${currentPage}`;
		if (currentPage === page()) {
			return `${label} active`;
		}
		return label;
	};

	return (
		<nav data-cui={"pagination"} class={styles.pagination}>
			<For each={paginationProps()}>
				{itemProps => (
					<IconButton
						data-cui={"pagination-item"}
						class={styles.paginationItem}
						pill={props.rounded}
						theme={itemProps.page === page() ? "primary" : "secondary"}
						aria-label={getAriaLabel(itemProps.page) ?? ""}
						size={props.size}
						{...itemProps}
					/>
				)}
			</For>
		</nav>
	);
}
