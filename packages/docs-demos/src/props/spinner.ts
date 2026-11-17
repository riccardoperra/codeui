import type { SpinnerProps } from "@codeui/kit";
import type { RootProps, TrackProps, IndicatorProps } from "@codeui/kit/spinner";
import type { PropNotes } from "./notes";

export type Spinner = Pick<SpinnerProps, "size" | "label" | "classes" | "class">;
export type SpinnerRoot = Pick<RootProps, "size" | "class">;
export type SpinnerTrack = Pick<TrackProps, "class">;
export type SpinnerIndicator = Pick<IndicatorProps, "class">;

export const notes = {
	Spinner: {
		size: { default: '"md"', description: "Visual size." },
		label: {
			description:
				'Accessible name. A nonempty label sets role="status"; omission hides the spinner.',
		},
		classes: { description: "Classes keyed by the rendered part names." },
		class: { description: "Class merged with the root or part styles." },
	},
	SpinnerRoot: {
		size: { default: '"md"', description: "Visual size." },
		class: { description: "Class merged with the root or part styles." },
	},
	SpinnerTrack: {
		class: { description: "Class merged with the root or part styles." },
	},
	SpinnerIndicator: {
		class: { description: "Class merged with the root or part styles." },
	},
} satisfies PropNotes;
