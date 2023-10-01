import { assignInlineVars } from "@vanilla-extract/dynamic";
import { FlowProps, JSX, splitProps } from "solid-js";
import { mergeClasses } from "../utils/css";
import * as styles from "./icon.css";

export type SvgIconProps = JSX.IntrinsicElements["svg"] & {
	size?: string;
};

export function SvgIcon(props: FlowProps<SvgIconProps>) {
	const [local, others] = splitProps(props, ["class", "size", "children", "style"]);
	const classes = () => mergeClasses(styles.icon, local.class);

	const mergedStyles = () => {
		const style = local.style || {};
		if (props.size) {
			return {
				...(style as {}),
				...assignInlineVars({
					[styles.iconSize]: props.size,
				}),
			};
		}
	};

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			style={mergedStyles()}
			class={classes()}
			{...others}
		>
			{local.children}
		</svg>
	);
}
