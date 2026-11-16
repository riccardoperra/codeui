import { splitProps } from "solid-js";
import * as K from "../../parts/kbd";
import { mergeClasses } from "../../utils/css";

export type KbdProps = K.RootProps & {
	/** Classes for the parts this component renders, keyed by part name. */
	classes?: K.KbdClasses;
};

/** One key or key label. Render a sequence as several Kbd elements. */
export function Kbd(props: KbdProps) {
	const [local, others] = splitProps(props, ["classes", "class"]);
	return <K.Root {...others} class={mergeClasses(local.classes?.root, local.class)} />;
}
