import "@codeui/styles/theme.css";
import "@codeui/styles/skeleton.css";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Skeleton as KSkeleton, type SkeletonRootProps as KSkeletonRootProps } from "@kobalte/core/skeleton";
import { splitProps, type ValidComponent } from "solid-js";
import * as styles from "../components/Skeleton/Skeleton.css";
import { mergeClasses } from "../utils/css";

import { skeletonParts, type SkeletonPart, type SkeletonClasses, type SkeletonVariants, type SkeletonStyles } from "@codeui/styles/skeleton";
export { skeletonParts, type SkeletonPart, type SkeletonClasses, type SkeletonVariants, type SkeletonStyles, skeletonStyles } from "@codeui/styles/skeleton";
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
			data-circle={others.circle || undefined}
			aria-hidden={others.visible === false ? undefined : true}
			class={mergeClasses(
				styles.root.classNames.base,
				local.class,
			)}
			{...others}
		/>
	);
}
