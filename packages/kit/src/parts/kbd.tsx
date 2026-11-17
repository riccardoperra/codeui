import "@codeui/styles/theme.css";
import "@codeui/styles/kbd.css";
import { type JSX, splitProps } from "solid-js";
import * as styles from "../components/Kbd/Kbd.css";
import { mergeClasses } from "../utils/css";

import { kbdParts, type KbdPart, type KbdClasses, type KbdSize, type KbdVariant, type KbdVariants, type KbdStyles, kbdStyles } from "@codeui/styles/kbd";
export { kbdParts, type KbdPart, type KbdClasses, type KbdSize, type KbdVariant, type KbdVariants, type KbdStyles, kbdStyles } from "@codeui/styles/kbd";
export type RootProps = JSX.IntrinsicElements["kbd"] & KbdVariants;

export function Root(props: RootProps) {
	const [local, others] = splitProps(props, ["class", "size", "variant"]);
	return (
		<kbd
			data-cui={kbdParts.root}
			data-size={local.size ?? "sm"}
			data-variant={local.variant ?? "keycap"}
			class={mergeClasses(kbdStyles.root({ size: local.size, variant: local.variant }), local.class)}
			{...others}
		/>
	);
}
