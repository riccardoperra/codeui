import "@codeui/styles/theme.css";
import "@codeui/styles/alert.css";
import {
	Alert as KAlert,
	type AlertRootProps as KAlertRootProps,
} from "@kobalte/core/alert";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { omit } from "solid-js";
import { type JSX, type ValidComponent } from "@solidjs/web";
import * as styles from "../components/Alert/Alert.css";
import { mergeClasses } from "../utils/css";

import {
	alertParts,
	type AlertPart,
	type AlertClasses,
	type AlertTone,
	type AlertVariants,
	type AlertStyles,
	alertStyles,
} from "@codeui/styles/alert";
export {
	alertParts,
	type AlertPart,
	type AlertClasses,
	type AlertTone,
	type AlertVariants,
	type AlertStyles,
	alertStyles,
} from "@codeui/styles/alert";
export type RootProps<T extends ValidComponent = "div"> = KAlertRootProps<T> &
	AlertVariants & { class?: string };

/** Renders `role="alert"`, so a newly mounted alert is announced. */
export function Root<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const local = props as PolymorphicProps<"div", RootProps>;
	const others = omit(local, "class", "tone", "fluid");
	return (
		<KAlert
			data-cui={alertParts.root}
			data-tone={local.tone ?? "neutral"}
			data-fluid={local.fluid ? "" : undefined}
			class={mergeClasses(styles.root(), local.class)}
			{...others}
		/>
	);
}

export type IconProps = JSX.HTMLAttributes<HTMLSpanElement>;

/** Decorative icon slot, hidden from assistive technology. */
export function Icon(props: IconProps) {
	const others = omit(props, "class");
	return (
		<span
			aria-hidden="true"
			data-cui={alertParts.icon}
			class={mergeClasses(alertStyles.icon(), props.class)}
			{...others}
		/>
	);
}

export type TitleProps = JSX.HTMLAttributes<HTMLDivElement>;

export function Title(props: TitleProps) {
	const others = omit(props, "class");
	return (
		<div
			data-cui={alertParts.title}
			class={mergeClasses(alertStyles.title(), props.class)}
			{...others}
		/>
	);
}

export type DescriptionProps = JSX.HTMLAttributes<HTMLDivElement>;

export function Description(props: DescriptionProps) {
	const others = omit(props, "class");
	return (
		<div
			data-cui={alertParts.description}
			class={mergeClasses(alertStyles.description(), props.class)}
			{...others}
		/>
	);
}

export type ActionProps = JSX.HTMLAttributes<HTMLDivElement>;

/** Holds the alert's controls, such as a button or a link. */
export function Action(props: ActionProps) {
	const others = omit(props, "class");
	return (
		<div
			data-cui={alertParts.action}
			class={mergeClasses(alertStyles.action(), props.class)}
			{...others}
		/>
	);
}
