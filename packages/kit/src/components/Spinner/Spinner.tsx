import { splitProps } from "solid-js";
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
	const [local, others] = splitProps(props, ["label", "classes", "class"]);
	return (
		<S.Root
			role={local.label ? "status" : undefined}
			aria-label={local.label}
			aria-hidden={local.label ? undefined : true}
			{...others}
			class={mergeClasses(local.classes?.root, local.class)}
		>
			<S.Track class={local.classes?.track} />
			<S.Indicator class={local.classes?.indicator} />
		</S.Root>
	);
}
