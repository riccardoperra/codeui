import { Show, omit } from "solid-js";
import { type JSX } from "@solidjs/web";
import * as P from "../../parts/progress";
import { mergeClasses } from "../../utils/css";
export type ProgressProps = Omit<P.RootProps, "children"> & {
	class?: string;
	classes?: P.ProgressClasses;
	label?: JSX.Element;
	showValue?: boolean;
	size?: "sm" | "md";
	"aria-label"?: string;
	"aria-labelledby"?: string;
};
export function Progress(props: ProgressProps) {
	const rest = omit(props, "label", "showValue", "classes", "class", "size");
	return (
		<P.Root
			{...rest}
			size={props.size ?? "sm"}
			class={mergeClasses(props.class, props.classes?.root)}
		>
			<Show when={props.label}>
				{label => <P.Label class={props.classes?.label}>{label()}</P.Label>}
			</Show>
			<Show when={props.showValue}>
				<P.ValueLabel class={props.classes?.valueLabel} />
			</Show>
			<P.Track class={props.classes?.track}>
				<P.Fill class={props.classes?.fill} />
			</P.Track>
		</P.Root>
	);
}
export { progressStyles, ProgressParts } from "../../parts/progress";
export type {
	ProgressClasses,
	ProgressPart,
	ProgressVariants,
	ProgressStyles,
} from "../../parts/progress";
