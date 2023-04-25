import { createControllableSetSignal, createControllableSignal } from "@kobalte/core";
import { createPagination, PaginationOptions } from "@solid-primitives/pagination";
import { createEffect, For, JSX, mergeProps, on } from "solid-js";
import { IconButton } from "../IconButton/IconButton";
import * as styles from "./Pagination.css";

type PaginationItemSize = "xs" | "sm" | "md" | "lg" | "xl";

interface PaginationProps extends PaginationOptions {
	rounded?: boolean;
	page?: number;
	size?: PaginationItemSize;
	onChange?: (page: number) => void;
}

function NextIcon(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			{...props}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M8.25 4.5l7.5 7.5-7.5 7.5"
			/>
		</svg>
	);
}

function PrevIcon(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			{...props}
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M15.75 19.5L8.25 12l7.5-7.5"
			/>
		</svg>
	);
}

export function Pagination(props: PaginationProps) {
	props = mergeProps(
		{
			prevContent: <PrevIcon class={styles.paginationIcon} />,
			nextContent: <NextIcon class={styles.paginationIcon} />,
			showLast: false,
			showFirst: false,
			maxPages: 5,
			showNext: true,
			showPrev: true,
			initialPage: props.page || props.initialPage || 1,
		} satisfies Partial<PaginationOptions>,
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
