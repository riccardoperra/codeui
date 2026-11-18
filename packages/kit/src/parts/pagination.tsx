import "@codeui/styles/theme.css";
import "@codeui/styles/pagination.css";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	createPagination,
	type PaginationOptions as CorePaginationOptions,
} from "@solid-primitives/pagination";
import { createEffect, mergeProps, on, splitProps, type JSX } from "solid-js";
import { IconButton, type IconButtonProps } from "../components/IconButton/IconButton";
import * as styles from "../components/Pagination/Pagination.css";
import { NextIcon } from "../icons/NextIcon";
import { PreviousIcon } from "../icons/PreviousIcon";
import { mergeClasses } from "../utils/css";

export interface PaginationOptions extends CorePaginationOptions {
	page?: number;
	onChange?: (page: number) => void;
}

export function createPaginationState(props: PaginationOptions) {
	const options = mergeProps(
		{
			prevContent: <PreviousIcon class={styles.paginationIcon} />,
			nextContent: <NextIcon class={styles.paginationIcon} />,
			showLast: false,
			showFirst: false,
			maxPages: 5,
			showNext: true,
			showPrev: true,
			initialPage: props.page || props.initialPage || 1,
		},
		props,
	);
	const [items, page, setPage] = createPagination(options);

	createEffect(
		on(
			() => props.page,
			currentPage => currentPage && setPage(currentPage),
			{ defer: true },
		),
	);
	createEffect(on(page, currentPage => props.onChange?.(currentPage), { defer: true }));

	return { items, page, setPage };
}

export type RootProps = JSX.HTMLAttributes<HTMLElement>;

export function Root(props: RootProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<nav
			{...others}
			data-cui="pagination"
			class={mergeClasses(styles.pagination, local.class)}
		/>
	);
}

export type ItemProps = Omit<
	PolymorphicProps<"button", IconButtonProps>,
	"aria-label"
> & {
	page?: number;
	active?: boolean;
	rounded?: boolean;
	"aria-label"?: string;
};

export function Item(props: ItemProps) {
	const [local, others] = splitProps(props, [
		"active",
		"class",
		"page",
		"rounded",
		"aria-label",
	]);
	const defaultLabel = () =>
		local.page ? (local.active ? `Page ${local.page} active` : `Page ${local.page}`) : "";

	return (
		<IconButton
			data-cui="pagination-item"
			pill={local.rounded}
			theme={local.active ? "primary" : "secondary"}
			aria-label={local["aria-label"] ?? defaultLabel()}
			{...others}
			class={mergeClasses(styles.paginationItem, local.class)}
		/>
	);
}
