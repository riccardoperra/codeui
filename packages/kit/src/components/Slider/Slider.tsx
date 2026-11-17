import { type Accessor, Show, splitProps } from "solid-js";
import * as P from "../../parts/slider";
import { createBaseFieldProps, type FieldContent } from "../Field/createBaseFieldProps";
import { mergeClasses } from "../../utils/css";
export type SliderProps = Omit<
	P.RootProps,
	"value" | "defaultValue" | "onChange" | "onChangeEnd" | "children"
> &
	FieldContent & {
		class?: string;
		classes?: P.SliderClasses;
		value?: number;
		defaultValue?: number;
		onChange?: (value: number) => void;
		onChangeEnd?: (value: number) => void;
		inputId?: string;
		"aria-label"?: string;
		"aria-labelledby"?: string;
		showValue?: boolean;
	};
export function createSliderProps(props: Accessor<SliderProps>) {
	const ids = createBaseFieldProps({}, props).ids;
	return {
		root: () => {
			const [local, rest] = splitProps(props(), [
				"label",
				"description",
				"errorMessage",
				"inputId",
				"aria-label",
				"aria-labelledby",
				"classes",
				"showValue",
				"value",
				"defaultValue",
				"onChange",
				"onChangeEnd",
			]);
			return {
				...rest,
				value: local.value === undefined ? undefined : [local.value],
				defaultValue: local.defaultValue === undefined ? undefined : [local.defaultValue],
				onChange: (values: number[]) => props().onChange?.(values[0]),
				onChangeEnd: (values: number[]) => props().onChangeEnd?.(values[0]),
			};
		},
		input: () => ({
			id: ids.input(),
			type: "hidden" as const,
			class: props().classes?.input,
		}),
		label: () => ({ id: ids.label(), class: props().classes?.label }),
		description: () => ({ id: ids.description(), class: props().classes?.description }),
		errorMessage: () => ({
			id: ids.errorMessage(),
			class: props().classes?.errorMessage,
		}),
	};
}
function ReadyThumb(
	props: SliderProps & { input: ReturnType<typeof createSliderProps>["input"] },
) {
	const context = P.useSliderContext();
	return (
		<P.Thumb
			class={props.classes?.thumb}
			aria-label={props["aria-label"]}
			aria-labelledby={props["aria-labelledby"]}
			aria-invalid={props.validationState === "invalid" || undefined}
			aria-valuetext={
				props.getValueLabel
					? props.getValueLabel({
							values: context.state.values(),
							min: context.minValue(),
							max: context.maxValue(),
						})
					: context.state.getThumbValueLabel(0)
			}
		>
			<P.Input {...props.input()} />
		</P.Thumb>
	);
}
export function Slider(props: SliderProps) {
	const field = createSliderProps(() => props);
	return (
		<P.Root
			{...field.root()}
			class={mergeClasses(props.class, props.classes?.root)}
			oncapture:keydown={(event: KeyboardEvent) => {
				if (
					props.readOnly &&
					[
						"ArrowLeft",
						"ArrowRight",
						"ArrowUp",
						"ArrowDown",
						"Home",
						"End",
						"PageUp",
						"PageDown",
					].includes(event.key)
				) {
					event.preventDefault();
					event.stopPropagation();
				}
			}}
			oncapture:pointerdown={(event: PointerEvent) => {
				if (props.readOnly) {
					event.preventDefault();
					event.stopPropagation();
				}
			}}
		>
			<Show when={props.label}>
				{label => <P.Label {...field.label()}>{label()}</P.Label>}
			</Show>
			<Show when={props.showValue}>
				<P.ValueLabel class={props.classes?.valueLabel} />
			</Show>
			<P.Track class={props.classes?.track}>
				<P.Fill class={props.classes?.fill} />
				<ReadyThumb {...props} input={field.input} />
			</P.Track>
			<Show when={props.description}>
				{description => (
					<P.Description {...field.description()}>{description()}</P.Description>
				)}
			</Show>
			<Show when={props.validationState === "invalid" && props.errorMessage}>
				{errorMessage => (
					<P.ErrorMessage {...field.errorMessage()}>{errorMessage()}</P.ErrorMessage>
				)}
			</Show>
		</P.Root>
	);
}
export { sliderStyles, SliderParts } from "../../parts/slider";
export type {
	SliderClasses,
	SliderPart,
	SliderVariants,
	SliderStyles,
} from "../../parts/slider";
