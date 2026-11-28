import "@codeui/styles/theme.css";
import "@codeui/styles/icon.css";
import { FlowProps, omit } from "solid-js";
import { JSX } from "@solidjs/web";
import { mergeClasses, assignInlineVars } from "../utils/css";
import * as styles from "./icon.css";

export type SvgIconProps = JSX.IntrinsicElements["svg"] & {
	size?: string;
};

export function SvgIcon(props: FlowProps<SvgIconProps>) {
	const others = omit(props, "class", "size", "children", "style");
	const classes = () => mergeClasses(styles.icon, props.class);

	const mergedStyles = () => {
		const style = props.style || {};
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
			{props.children}
		</svg>
	);
}
