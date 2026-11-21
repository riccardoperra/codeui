import { skeletonStyleProps, type SkeletonVariants } from "@codeui/styles/skeleton";
import type { ComponentProps, CSSProperties } from "react";
import { classes } from "../classes";
import { flag } from "./utils";

export type SkeletonProps = ComponentProps<"div"> &
	SkeletonVariants & {
		/** Shows the placeholder. When false the children render as they are. Defaults to true. */
		visible?: boolean;
		/** Any CSS width. Defaults to the full width. */
		width?: CSSProperties["width"];
		/** Any CSS height. Defaults to the content height. */
		height?: CSSProperties["height"];
		/** Any CSS border radius. */
		radius?: CSSProperties["borderRadius"];
	};

/**
 * A loading placeholder. Mark the region that is loading with `aria-busy`; the placeholder itself
 * is hidden from assistive technology while visible.
 */
export function Skeleton({
	circle,
	animate = true,
	visible = true,
	width,
	height,
	radius,
	className,
	style,
	...props
}: SkeletonProps) {
	const { class: root, ...appearance } = skeletonStyleProps({ circle, animate });
	return (
		<div
			aria-hidden={visible ? true : undefined}
			data-visible={flag(visible)}
			{...appearance}
			{...props}
			className={classes(root, className)}
			style={{
				width: circle ? (height ?? width) : (width ?? "100%"),
				height: height ?? "auto",
				...(radius !== undefined && { borderRadius: radius }),
				...style,
			}}
		/>
	);
}
