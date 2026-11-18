import type { SkeletonStyleOptions } from "../generated-appearance/skeleton";
import * as styles from "../components/Skeleton/Skeleton.css";
export const skeletonParts = {
	root: "skeleton",
} as const;

export type SkeletonPart = keyof typeof skeletonParts;
export type SkeletonClasses = Partial<Record<SkeletonPart, string>>;
export type SkeletonVariants = Omit<SkeletonStyleOptions, "class">;

export type SkeletonStyles = {
	[P in SkeletonPart]: () => string;
};

export const skeletonStyles: SkeletonStyles = {
	root: styles.root,
};
