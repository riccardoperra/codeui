"use client";

import {
	sliderParts,
	sliderStyleProps,
	sliderStyles,
	type SliderClasses,
} from "@codeui/styles/slider";
import { useId, type ReactNode, type Ref } from "react";
import {
	Label,
	Slider as AriaSlider,
	SliderFill,
	SliderOutput,
	SliderThumb,
	SliderTrack,
	composeRenderProps,
	type SliderProps as AriaSliderProps,
} from "react-aria-components";
import { classes } from "../classes";
import { flag } from "./utils";

export type { SliderClasses };

export type SliderProps<T extends number | number[] = number | number[]> = Omit<
	AriaSliderProps<T>,
	"children"
> & {
	ref?: Ref<HTMLDivElement>;
	label?: ReactNode;
	description?: ReactNode;
	/** Shown while `isInvalid`. */
	errorMessage?: ReactNode;
	isInvalid?: boolean;
	/** Shows the formatted value beside the label. */
	showValue?: boolean;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: SliderClasses;
};

/** React Aria's Slider. An array value renders one thumb per value. */
export function Slider<T extends number | number[]>({
	label,
	description,
	errorMessage,
	isInvalid,
	showValue,
	orientation = "horizontal",
	classes: parts,
	className,
	"aria-describedby": describedBy,
	...props
}: SliderProps<T>) {
	const id = useId();
	const descriptionId = description ? `${id}-description` : undefined;
	const errorId = isInvalid && errorMessage ? `${id}-error` : undefined;
	const thumbDescribedBy =
		[describedBy, descriptionId, errorId].filter(Boolean).join(" ") || undefined;
	const { class: track, ...trackAttributes } = sliderStyleProps.track({ orientation });
	const { class: fill, ...fillAttributes } = sliderStyleProps.fill({ orientation });
	const vertical = orientation === "vertical";
	return (
		<AriaSlider
			data-cui={sliderParts.root}
			{...props}
			orientation={orientation}
			className={composeRenderProps(className, className =>
				classes(sliderStyles.root(), parts?.root, className),
			)}
		>
			{({ state }) => (
				<>
					{label ? (
						<Label
							data-cui={sliderParts.label}
							className={classes(sliderStyles.label(), parts?.label)}
						>
							{label}
						</Label>
					) : null}
					{showValue ? (
						<SliderOutput
							data-cui={sliderParts.valueLabel}
							className={classes(sliderStyles.valueLabel(), parts?.valueLabel)}
						/>
					) : null}
					<SliderTrack {...trackAttributes} className={classes(track, parts?.track)}>
						<SliderFill
							{...fillAttributes}
							className={classes(fill, parts?.fill)}
							// React Aria merges this over its default; the stylesheet sets the thickness.
							style={vertical ? { width: undefined } : { height: undefined }}
						/>
						{state.values.map((_, index) => (
							<SliderThumb
								key={index}
								index={index}
								isInvalid={isInvalid}
								aria-describedby={thumbDescribedBy}
								data-cui={sliderParts.thumb}
								data-invalid={flag(isInvalid)}
								className={classes(sliderStyles.thumb(), parts?.thumb)}
								// React Aria translates the thumb by -50% on both axes; centre it on the rail.
								style={vertical ? { left: "50%" } : { top: "50%" }}
							/>
						))}
					</SliderTrack>
					{descriptionId ? (
						<span
							id={descriptionId}
							data-cui={sliderParts.description}
							className={classes(sliderStyles.description(), parts?.description)}
						>
							{description}
						</span>
					) : null}
					{errorId ? (
						<span
							id={errorId}
							data-cui={sliderParts.errorMessage}
							className={classes(sliderStyles.errorMessage(), parts?.errorMessage)}
						>
							{errorMessage}
						</span>
					) : null}
				</>
			)}
		</AriaSlider>
	);
}
