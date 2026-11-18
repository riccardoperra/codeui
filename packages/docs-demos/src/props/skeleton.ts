import type { SkeletonProps } from "@codeui/kit";
import type { RootProps } from "@codeui/kit/skeleton/parts";
import type { PropNotes } from "./notes";

export type Skeleton = Pick<
	SkeletonProps,
	"width" | "height" | "radius" | "style" | "classes" | "class"
>;
export type SkeletonInherited = Pick<SkeletonProps, "visible" | "animate" | "circle">;
export type SkeletonRoot = Pick<RootProps, "class">;
export type SkeletonRootInherited = Pick<
	RootProps,
	"visible" | "animate" | "circle" | "width" | "height" | "radius"
>;

export const notes = {
	Skeleton: {
		width: {
			default: '"100%"',
			description: "CSS width. Circle uses height first, then width.",
		},
		height: { default: '"auto"', description: "CSS height." },
		radius: { description: "CSS border radius." },
		style: { description: "Inline CSS properties merged after dimensions." },
		classes: { description: "Classes keyed by the rendered part names." },
		class: { description: "Class merged with the root or part styles." },
	},
	SkeletonInherited: {
		visible: {
			default: "true",
			description: "Show the placeholder instead of its children.",
		},
		animate: {
			default: "true",
			description: "Pulse the visible placeholder unless reduced motion is requested.",
		},
		circle: { default: "false", description: "Render a circular placeholder." },
	},
	SkeletonRoot: {
		class: { description: "Class merged with the root or part styles." },
	},
	SkeletonRootInherited: {
		visible: {
			default: "true",
			description: "Show the placeholder instead of its children.",
		},
		animate: {
			default: "true",
			description: "Pulse the visible placeholder unless reduced motion is requested.",
		},
		circle: { default: "false", description: "Render a circular placeholder." },
		width: {
			default: '"100%"',
			description: "CSS width. Circle uses height first, then width.",
		},
		height: { default: '"auto"', description: "CSS height." },
		radius: { description: "CSS border radius." },
	},
} satisfies PropNotes;
