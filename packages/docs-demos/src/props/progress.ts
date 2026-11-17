import type { ProgressProps } from "@codeui/kit";
import type {
	RootProps,
	LabelProps,
	TrackProps,
	FillProps,
	ValueLabelProps,
} from "@codeui/kit/progress";
import type { PropNotes } from "./notes";

export type Progress = Pick<
	ProgressProps,
	"size" | "label" | "showValue" | "classes" | "class"
>;
export type ProgressInherited = Pick<
	ProgressProps,
	"value" | "minValue" | "maxValue" | "indeterminate" | "getValueLabel"
>;
export type ProgressRoot = Pick<RootProps, "size">;
export type ProgressLabel = Pick<LabelProps, "size">;
export type ProgressTrack = Pick<TrackProps, "size">;
export type ProgressFill = Pick<FillProps, "size">;
export type ProgressValueLabel = Pick<ValueLabelProps, "size">;
export type ProgressRootInherited = Pick<
	RootProps,
	"value" | "minValue" | "maxValue" | "indeterminate" | "getValueLabel"
>;

export const notes = {
	Progress: {
		size: { default: '"sm"', description: "Visual size." },
		label: { description: "Accessible name or visible JSX label." },
		showValue: { default: "false", description: "Render the formatted value label." },
		classes: { description: "Classes keyed by the rendered part names." },
		class: { description: "Class merged with the root or part styles." },
	},
	ProgressInherited: {
		value: { default: "0", description: "Current task value." },
		minValue: { default: "0", description: "Lower bound." },
		maxValue: { default: "100", description: "Upper bound." },
		indeterminate: {
			default: "false",
			description: "Show an unknown amount of work without aria-valuenow.",
		},
		getValueLabel: {
			description: "Format determinate value text. Ignored while indeterminate.",
		},
	},
	ProgressRoot: {
		size: { description: "Size marker. Track reads md from its root ancestor." },
	},
	ProgressLabel: {
		size: { description: "Size marker. Track reads md from its root ancestor." },
	},
	ProgressTrack: {
		size: { description: "Size marker. Track reads md from its root ancestor." },
	},
	ProgressFill: {
		size: { description: "Size marker. Track reads md from its root ancestor." },
	},
	ProgressValueLabel: {
		size: { description: "Size marker. Track reads md from its root ancestor." },
	},
	ProgressRootInherited: {
		value: { default: "0", description: "Current task value." },
		minValue: { default: "0", description: "Lower bound." },
		maxValue: { default: "100", description: "Upper bound." },
		indeterminate: {
			default: "false",
			description: "Show an unknown amount of work without aria-valuenow.",
		},
		getValueLabel: {
			description: "Format determinate value text. Ignored while indeterminate.",
		},
	},
} satisfies PropNotes;
