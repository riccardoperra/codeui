import "@codeui/styles/theme.css";
import "@codeui/styles/spinner.css";
import { omit } from "solid-js";
import { type JSX } from "@solidjs/web";
import * as styles from "../components/Spinner/Spinner.css";
import { mergeClasses } from "../utils/css";

import {
	spinnerParts,
	type SpinnerPart,
	type SpinnerClasses,
	type SpinnerSize,
	type SpinnerVariants,
	type SpinnerStyles,
	spinnerStyles,
} from "@codeui/styles/spinner";
export {
	spinnerParts,
	type SpinnerPart,
	type SpinnerClasses,
	type SpinnerSize,
	type SpinnerVariants,
	type SpinnerStyles,
	spinnerStyles,
} from "@codeui/styles/spinner";
export type RootProps = JSX.SvgSVGAttributes<SVGSVGElement> & SpinnerVariants;

/** The 24×24 viewBox that Track and Indicator draw in. */
export function Root(props: RootProps) {
	const others = omit(props, "class", "size");
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			data-cui={spinnerParts.root}
			data-size={props.size ?? "md"}
			class={mergeClasses(styles.root(), props.class)}
			{...others}
		/>
	);
}

export type TrackProps = JSX.CircleSVGAttributes<SVGCircleElement>;

export function Track(props: TrackProps) {
	const others = omit(props, "class");
	return (
		<circle
			cx="12"
			cy="12"
			r="9"
			stroke-width="3"
			data-cui={spinnerParts.track}
			class={mergeClasses(spinnerStyles.track(), props.class)}
			{...others}
		/>
	);
}

export type IndicatorProps = JSX.PathSVGAttributes<SVGPathElement>;

export function Indicator(props: IndicatorProps) {
	const others = omit(props, "class");
	return (
		<path
			d="M12 3a9 9 0 0 1 9 9"
			stroke-width="3"
			data-cui={spinnerParts.indicator}
			class={mergeClasses(spinnerStyles.indicator(), props.class)}
			{...others}
		/>
	);
}
