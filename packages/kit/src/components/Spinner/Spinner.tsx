import { omit } from "solid-js";
import * as S from "../../parts/spinner";
import { mergeClasses } from "../../utils/css";

export type SpinnerProps = Omit<S.RootProps, "children"> & {
	/**
	 * Accessible name. With a label the spinner is a status region. Without one
	 * it is hidden, for use inside a control that already announces its busy state.
	 */
	label?: string;
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: S.SpinnerClasses;
};

export function Spinner(props: SpinnerProps) {
	const others = omit(props, "label", "classes", "class");
	return (
		<S.Root
			role={props.label ? "status" : undefined}
			aria-label={props.label}
			aria-hidden={props.label ? undefined : "true"}
			{...others}
			class={mergeClasses(props.classes?.root, props.class)}
		>
			<S.Track class={props.classes?.track} />
			<S.Indicator class={props.classes?.indicator} />
		</S.Root>
	);
}
