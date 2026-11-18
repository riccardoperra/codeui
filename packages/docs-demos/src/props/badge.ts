import type { BadgeProps } from "@codeui/kit";
import type { RootProps, IconProps, LabelProps } from "@codeui/kit/badge/parts";
import type { PropNotes } from "./notes";

export type Badge = Pick<
	BadgeProps,
	"tone" | "size" | "variant" | "icon" | "classes" | "class"
>;
export type BadgeInherited = Pick<BadgeProps, "textValue">;
export type BadgeRoot = Pick<RootProps, "tone" | "size" | "variant" | "class">;
export type BadgeIcon = Pick<IconProps, "class">;
export type BadgeLabel = Pick<LabelProps, "class">;
export type BadgeRootInherited = Pick<RootProps, "textValue">;

export const notes = {
	Badge: {
		tone: { default: '"neutral"', description: "Semantic status color." },
		size: { default: '"sm"', description: "Visual size." },
		variant: { default: '"soft"', description: "Tinted fill or outlined shape." },
		icon: { description: "Decorative JSX icon." },
		classes: { description: "Classes keyed by the rendered part names." },
		class: { description: "Class merged with the root or part styles." },
	},
	BadgeInherited: {
		textValue: { description: "Plain text alternative for rich badge content." },
	},
	BadgeRoot: {
		tone: { default: '"neutral"', description: "Semantic status color." },
		size: { default: '"sm"', description: "Visual size." },
		variant: { default: '"soft"', description: "Tinted fill or outlined shape." },
		class: { description: "Class merged with the root or part styles." },
	},
	BadgeIcon: {
		class: { description: "Class merged with the root or part styles." },
	},
	BadgeLabel: {
		class: { description: "Class merged with the root or part styles." },
	},
	BadgeRootInherited: {
		textValue: { description: "Plain text alternative for rich badge content." },
	},
} satisfies PropNotes;
