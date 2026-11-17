import { mergeClasses } from "../utils/css";
import * as styles from "../components/Slider/Slider.css";
export type SliderVariants = { orientation?: "horizontal" | "vertical" };
export const sliderParts = {
	root: "slider-root",
	label: "slider-label",
	description: "slider-description",
	errorMessage: "slider-error-message",
	track: "slider-track",
	fill: "slider-fill",
	thumb: "slider-thumb",
	input: "slider-input",
	valueLabel: "slider-value-label",
} as const;
export type SliderPart = keyof typeof sliderParts;
export type SliderClasses = Partial<Record<SliderPart, string>>;
export type SliderStyles = Record<SliderPart, (variants?: SliderVariants) => string>;
export const sliderStyles: SliderStyles = {
	root: () => styles.root,
	label: () => styles.label,
	description: () => styles.description,
	errorMessage: () => styles.errorMessage,
	track: variants => styles.track({ orientation: variants?.orientation }),
	fill: variants => styles.fill({ orientation: variants?.orientation }),
	thumb: () => styles.thumb,
	input: () => styles.input,
	valueLabel: () => styles.valueLabel,
};
