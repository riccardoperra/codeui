import type { AlertProps } from "@codeui/kit";
import type {
	RootProps,
	IconProps,
	TitleProps,
	DescriptionProps,
	ActionProps,
} from "@codeui/kit/alert/parts";
import type { PropNotes } from "./notes";

export type Alert = Pick<
	AlertProps,
	| "tone"
	| "fluid"
	| "title"
	| "description"
	| "icon"
	| "showIcon"
	| "action"
	| "classes"
	| "class"
>;
export type AlertRoot = Pick<RootProps, "tone" | "fluid" | "class">;
export type AlertIcon = Pick<IconProps, "class">;
export type AlertTitle = Pick<TitleProps, "class">;
export type AlertDescription = Pick<DescriptionProps, "class">;
export type AlertAction = Pick<ActionProps, "class">;

export const notes = {
	Alert: {
		tone: { default: '"neutral"', description: "Semantic status color." },
		fluid: { default: "false", description: "Fill the available width." },
		title: { description: "JSX title above the description." },
		description: {
			default: "children",
			description: "JSX message. Takes precedence over children.",
		},
		icon: { description: "Decorative JSX icon." },
		showIcon: {
			default: "false",
			description:
				"Show a custom icon or the status tone icon. Neutral has no default icon.",
		},
		action: { description: "JSX controls beside the message." },
		classes: { description: "Classes keyed by the rendered part names." },
		class: { description: "Class merged with the root or part styles." },
	},
	AlertRoot: {
		tone: { default: '"neutral"', description: "Semantic status color." },
		fluid: { default: "false", description: "Fill the available width." },
		class: { description: "Class merged with the root or part styles." },
	},
	AlertIcon: {
		class: { description: "Class merged with the root or part styles." },
	},
	AlertTitle: {
		class: { description: "Class merged with the root or part styles." },
	},
	AlertDescription: {
		class: { description: "Class merged with the root or part styles." },
	},
	AlertAction: {
		class: { description: "Class merged with the root or part styles." },
	},
} satisfies PropNotes;
