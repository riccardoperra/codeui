"use client";

import { pagination, paginationIcon, paginationItem } from "@codeui/styles/pagination";
import { useState, type ComponentProps, type ReactNode } from "react";
import { IconButton, type IconButtonProps } from "./controls";
import { classes } from "./classes";

export type PaginationProps = Omit<ComponentProps<"nav">, "children" | "onChange"> & {
	pages: number;
	page?: number;
	defaultPage?: number;
	onChange?: (page: number) => void;
	maxPages?: number;
	size?: IconButtonProps["size"];
	rounded?: boolean;
	showFirst?: boolean;
	showLast?: boolean;
	showPrev?: boolean;
	showNext?: boolean;
	firstLabel?: string;
	lastLabel?: string;
	previousLabel?: string;
	nextLabel?: string;
	pageLabel?: (page: number) => string;
};

export function Pagination({
	pages,
	page,
	defaultPage = 1,
	onChange,
	maxPages = 5,
	size = "sm",
	rounded,
	showFirst = false,
	showLast = false,
	showPrev = true,
	showNext = true,
	firstLabel = "First page",
	lastLabel = "Last page",
	previousLabel = "Previous page",
	nextLabel = "Next page",
	pageLabel = page => `Page ${page}`,
	className,
	"aria-label": label = "Pagination",
	...props
}: PaginationProps) {
	const [localPage, setLocalPage] = useState(defaultPage);
	const count = Math.max(0, Math.trunc(pages));
	if (!Number.isFinite(count) || count === 0) return null;

	const current = Math.min(count, Math.max(1, Math.trunc(page ?? localPage) || 1));
	const visible = Math.min(
		count,
		Math.max(1, Number.isFinite(maxPages) ? Math.trunc(maxPages) : 5),
	);
	const first = Math.max(
		1,
		Math.min(current - Math.floor(visible / 2), count - visible + 1),
	);

	function changePage(next: number) {
		if (next === current) return;
		if (page === undefined) setLocalPage(next);
		onChange?.(next);
	}

	const renderBoundary = (label: string, target: number, icon: ReactNode) => (
		<IconButton
			aria-label={label}
			pill={rounded}
			size={size}
			variant="secondary"
			isDisabled={current === target}
			onPress={() => changePage(target)}
		>
			{icon}
		</IconButton>
	);

	return (
		<nav
			{...props}
			aria-label={label}
			className={classes(pagination, className)}
			data-cui="pagination"
		>
			{showFirst && renderBoundary(firstLabel, 1, <PageArrow direction="left" edge />)}
			{showPrev &&
				renderBoundary(
					previousLabel,
					Math.max(1, current - 1),
					<PageArrow direction="left" />,
				)}
			{Array.from({ length: visible }, (_, index) => {
				const number = first + index;

				return (
					<IconButton
						aria-current={number === current ? "page" : undefined}
						aria-label={pageLabel(number)}
						className={paginationItem}
						key={number}
						onPress={() => changePage(number)}
						pill={rounded}
						size={size}
						variant={number === current ? "primary" : "secondary"}
					>
						{number}
					</IconButton>
				);
			})}
			{showNext &&
				renderBoundary(
					nextLabel,
					Math.min(count, current + 1),
					<PageArrow direction="right" />,
				)}
			{showLast && renderBoundary(lastLabel, count, <PageArrow direction="right" edge />)}
		</nav>
	);
}

function PageArrow({ direction, edge }: { direction: "left" | "right"; edge?: boolean }) {
	return (
		<svg
			aria-hidden="true"
			className={paginationIcon}
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<g transform={direction === "right" ? "translate(16 0) scale(-1 1)" : undefined}>
				<path d="m10 4-4 4 4 4" />
				{edge && <path d="M3 4v8" />}
			</g>
		</svg>
	);
}
