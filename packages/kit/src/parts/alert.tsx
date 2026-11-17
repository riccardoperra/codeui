import "@codeui/styles/theme.css";
import "@codeui/styles/alert.css";
import {
	Alert as KAlert,
	type AlertRootProps as KAlertRootProps,
} from "@kobalte/core/alert";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { type JSX, splitProps, type ValidComponent } from "solid-js";
import * as styles from "../components/Alert/Alert.css";
import { mergeClasses } from "../utils/css";

import { alertParts, type AlertPart, type AlertClasses, type AlertTone, type AlertVariants, type AlertStyles, alertStyles } from "@codeui/styles/alert";
export { alertParts, type AlertPart, type AlertClasses, type AlertTone, type AlertVariants, type AlertStyles, alertStyles } from "@codeui/styles/alert";
export type RootProps<T extends ValidComponent = "div"> = KAlertRootProps<T> &
	AlertVariants & { class?: string };

/** Renders `role="alert"`, so a newly mounted alert is announced. */
export function Root<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", RootProps>, [
		"class",
		"tone",
		"fluid",
	]);
	return (
		<KAlert
			data-cui={alertParts.root}
			data-tone={local.tone ?? "neutral"}
			data-fluid={local.fluid ? "" : undefined}
			class={mergeClasses(
				alertStyles.root({ tone: local.tone, fluid: local.fluid }),
				local.class,
			)}
			{...others}
		/>
	);
}

export type IconProps = JSX.HTMLAttributes<HTMLSpanElement>;

/** Decorative icon slot, hidden from assistive technology. */
export function Icon(props: IconProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<span
			aria-hidden="true"
			data-cui={alertParts.icon}
			class={mergeClasses(alertStyles.icon(), local.class)}
			{...others}
		/>
	);
}

export type TitleProps = JSX.HTMLAttributes<HTMLDivElement>;

export function Title(props: TitleProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div
			data-cui={alertParts.title}
			class={mergeClasses(alertStyles.title(), local.class)}
			{...others}
		/>
	);
}

export type DescriptionProps = JSX.HTMLAttributes<HTMLDivElement>;

export function Description(props: DescriptionProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div
			data-cui={alertParts.description}
			class={mergeClasses(alertStyles.description(), local.class)}
			{...others}
		/>
	);
}

export type ActionProps = JSX.HTMLAttributes<HTMLDivElement>;

/** Holds the alert's controls, such as a button or a link. */
export function Action(props: ActionProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<div
			data-cui={alertParts.action}
			class={mergeClasses(alertStyles.action(), local.class)}
			{...others}
		/>
	);
}
