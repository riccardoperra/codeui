import { Show, splitProps, type JSX } from "solid-js";
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
	const [local, rest] = splitProps(props, [
		"label",
		"showValue",
		"classes",
		"class",
		"size",
	]);
	return (
		<P.Root
			{...rest}
			size={local.size ?? "sm"}
			class={mergeClasses(local.class, local.classes?.root)}
		>
			<Show when={local.label}>
				<P.Label class={local.classes?.label}>{local.label}</P.Label>
			</Show>
			<Show when={local.showValue}>
				<P.ValueLabel class={local.classes?.valueLabel} />
			</Show>
			<P.Track class={local.classes?.track}>
				<P.Fill class={local.classes?.fill} />
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
