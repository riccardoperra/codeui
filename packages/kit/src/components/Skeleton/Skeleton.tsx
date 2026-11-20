import { omit } from "solid-js";
import { type JSX } from "@solidjs/web";
import * as S from "../../parts/skeleton";
import { mergeClasses } from "../../utils/css";

export type SkeletonProps = Omit<S.RootProps, "width" | "height" | "radius" | "style"> & {
	/** Any CSS width. Defaults to the full width. */
	width?: JSX.CSSProperties["width"];
	/** Any CSS height. Defaults to the content height. */
	height?: JSX.CSSProperties["height"];
	/** Any CSS border radius. */
	radius?: JSX.CSSProperties["border-radius"];
	style?: JSX.CSSProperties;
	children?: JSX.Element;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: S.SkeletonClasses;
};

/**
 * A loading placeholder. Mark the region that is loading with `aria-busy`;
 * the placeholder itself is hidden from assistive technology while visible.
 */
export function Skeleton(props: SkeletonProps) {
	const others = omit(props, "width", "height", "radius", "style", "classes", "class");
	const style = (): JSX.CSSProperties => ({
		width: others.circle ? (props.height ?? props.width) : (props.width ?? "100%"),
		height: props.height ?? "auto",
		...(props.radius !== undefined && { "border-radius": props.radius }),
		...props.style,
	});
	return (
		<S.Root
			{...others}
			style={style()}
			class={mergeClasses(props.classes?.root, props.class)}
		/>
	);
}
