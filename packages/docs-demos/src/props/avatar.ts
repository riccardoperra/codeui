import type { AvatarProps } from "@codeui/kit";
import type { RootProps } from "@codeui/kit/avatar/parts";
import type { PropNotes } from "./notes";

/** Props that Avatar adds. Every other prop goes to the root span. */
export type Avatar = Pick<
	AvatarProps,
	| "name"
	| "identifier"
	| "src"
	| "initials"
	| "size"
	| "unassigned"
	| "tooltip"
	| "classes"
	| "class"
>;

/** Props of the Root part from @codeui/kit/avatar/parts. */
export type AvatarRoot = Pick<RootProps, "size" | "unassigned" | "hue" | "class">;

export const notes = {
	Avatar: {
		name: {
			description:
				"The person's name: the accessible name and the tooltip. Initials come from it.",
		},
		identifier: {
			description:
				"A stable id, such as a user id. The fill hue comes from it. Without it the fill is neutral.",
		},
		src: {
			description:
				"URL of the picture. The initials show while it is missing or when it fails to load.",
		},
		initials: { description: "Overrides the initials taken from name." },
		size: {
			default: '"xs"',
			description:
				"Height on the shared control scale: xs, sm, md or lg. Follows density.",
		},
		unassigned: {
			default: "false",
			description: "An empty dashed circle, named Unassigned unless name is set.",
		},
		tooltip: {
			default: "true",
			description: "Shows the name in the kit Tooltip on hover.",
		},
		classes: { description: "Classes keyed by part: root, image and fallback." },
		class: { description: "Class merged after the kit styles on the root." },
	},
	AvatarRoot: {
		size: { default: '"xs"', description: "Height on the shared control scale." },
		unassigned: {
			default: "false",
			description: "Sets data-unassigned: the dashed empty circle.",
		},
		hue: {
			description:
				"Fill hue in degrees. Without it the fill is neutral. Use avatarHue(id).",
		},
		class: { description: "Class merged after the kit styles." },
	},
} satisfies PropNotes;
