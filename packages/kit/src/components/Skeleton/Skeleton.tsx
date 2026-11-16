import { type JSX, splitProps } from "solid-js";
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
	const [local, others] = splitProps(props, ["width", "height", "radius", "style", "classes", "class"]);
	const style = (): JSX.CSSProperties => ({
		width: others.circle ? (local.height ?? local.width) : (local.width ?? "100%"),
		height: local.height ?? "auto",
		...(local.radius !== undefined && { "border-radius": local.radius }),
		...local.style,
	});
	return <S.Root {...others} style={style()} class={mergeClasses(local.classes?.root, local.class)} />;
}
