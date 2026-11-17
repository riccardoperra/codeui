import * as styles from "../components/Skeleton/Skeleton.css";
import { mergeClasses } from "../utils/css";
export const skeletonParts = {
	root: "skeleton-root",
} as const;

export type SkeletonPart = keyof typeof skeletonParts;
export type SkeletonClasses = Partial<Record<SkeletonPart, string>>;
export type SkeletonVariants = { circle?: boolean; animate?: boolean };

export type SkeletonStyles = {
	[P in SkeletonPart]: (variants?: SkeletonVariants) => string;
};

export const skeletonStyles: SkeletonStyles = {
	root: variants =>
		styles.root({ circle: variants?.circle, animate: variants?.animate ?? true }),
};
