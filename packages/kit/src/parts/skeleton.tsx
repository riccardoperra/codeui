import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Skeleton as KSkeleton, type SkeletonRootProps as KSkeletonRootProps } from "@kobalte/core/skeleton";
import { splitProps, type ValidComponent } from "solid-js";
import * as styles from "../components/Skeleton/Skeleton.css";
import { mergeClasses } from "../utils/css";

export const skeletonParts = {
	root: "skeleton-root",
} as const;

export type SkeletonPart = keyof typeof skeletonParts;
export type SkeletonClasses = Partial<Record<SkeletonPart, string>>;
export type SkeletonVariants = { circle?: boolean; animate?: boolean };

export type SkeletonStyles = { [P in SkeletonPart]: (variants?: SkeletonVariants) => string };

export const skeletonStyles: SkeletonStyles = {
	root: variants => styles.root({ circle: variants?.circle, animate: variants?.animate ?? true }),
};

export type RootProps<T extends ValidComponent = "div"> = KSkeletonRootProps<T> & { class?: string };

/**
 * Kobalte's Skeleton. While `visible` it is a placeholder hidden from
 * assistive technology; the loading region around it owns `aria-busy`.
 */
export function Root<T extends ValidComponent = "div">(props: PolymorphicProps<T, RootProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", RootProps>, ["class"]);
	return (
		<KSkeleton
			data-cui={skeletonParts.root}
			aria-hidden={others.visible === false ? undefined : true}
			class={mergeClasses(
				skeletonStyles.root({ circle: others.circle, animate: others.animate }),
				local.class,
			)}
			{...others}
		/>
	);
}
