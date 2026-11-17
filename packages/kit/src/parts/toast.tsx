import "@codeui/styles/theme.css";
import "@codeui/styles/toast.css";
import { kobalteStyle } from "../utils/kobalte-style";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	Toast as KToast,
	type ToastCloseButtonProps as KToastCloseButtonProps,
	type ToastDescriptionProps as KToastDescriptionProps,
	type ToastListProps as KToastListProps,
	type ToastProgressFillProps as KToastProgressFillProps,
	type ToastProgressTrackProps as KToastProgressTrackProps,
	type ToastRegionProps as KToastRegionProps,
	type ToastRootProps as KToastRootProps,
	type ToastTitleProps as KToastTitleProps,
} from "@kobalte/core/toast";
import { type JSX, splitProps, type ValidComponent } from "solid-js";
import * as styles from "../components/Toast/Toast.css";
import { CloseIcon } from "../icons/CloseIcon";
import { mergeClasses } from "../utils/css";

import { toastParts, type ToastPart, type ToastClasses, type ToastTone, type ToastPosition, type ToastVariants, type ToastStyles, toastStyles } from "@codeui/styles/toast";
export { toastParts, type ToastPart, type ToastClasses, type ToastTone, type ToastPosition, type ToastVariants, type ToastStyles, toastStyles } from "@codeui/styles/toast";
export type RegionProps<T extends ValidComponent = "div"> = KToastRegionProps<T> & {
	position?: ToastPosition;
	class?: string;
};

/** Fixed to a viewport edge. Toasts rise from the bottom and drop from the top. */
export function Region<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RegionProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", RegionProps>, [
		"class",
		"position",
	]);
	return (
		<KToast.Region
			data-cui={toastParts.region}
			data-position={local.position ?? "bottom-center"}
			class={mergeClasses(styles.region(), local.class)}
			{...others}
		/>
	);
}

/**
 * Renders a `div`, not Kobalte's `ol`: toasts carry `role="status"`, which a
 * list item may not take.
 */
export function List<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KToastListProps<T> & { class?: string }>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", KToastListProps>, [
		"class",
	]);
	return (
		<KToast.List
			as="div"
			data-cui={toastParts.list}
			class={mergeClasses(toastStyles.list(), local.class)}
			{...others}
		/>
	);
}

export type RootProps<T extends ValidComponent = "div"> = KToastRootProps<T> & {
	tone?: ToastTone;
	class?: string;
};

/**
 * Announced politely, or assertively for the danger tone. Set `priority`
 * to override.
 */
export function Root<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"li", RootProps>, [
		"class",
		"style",
		"tone",
		"priority",
	]);
	return (
		<KToast
			style={kobalteStyle(local.style)}
			as="div"
			data-cui={toastParts.root}
			data-tone={local.tone ?? "neutral"}
			priority={local.priority ?? (local.tone === "danger" ? "high" : "low")}
			class={mergeClasses(styles.root(), local.class)}
			{...others}
		/>
	);
}

export function Title<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KToastTitleProps<T> & { class?: string }>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", KToastTitleProps>, [
		"class",
	]);
	return (
		<KToast.Title
			data-cui={toastParts.title}
			class={mergeClasses(toastStyles.title(), local.class)}
			{...others}
		/>
	);
}

export function Description<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KToastDescriptionProps<T> & { class?: string }>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", KToastDescriptionProps>,
		["class"],
	);
	return (
		<KToast.Description
			data-cui={toastParts.description}
			class={mergeClasses(toastStyles.description(), local.class)}
			{...others}
		/>
	);
}

/** Shows a close icon when it has no children. Pass a localized `aria-label`. */
export function CloseButton<T extends ValidComponent = "button">(
	props: PolymorphicProps<
		T,
		KToastCloseButtonProps<T> & { class?: string; children?: JSX.Element }
	>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<
			"button",
			KToastCloseButtonProps & { children?: JSX.Element }
		>,
		["class", "children"],
	);
	return (
		<KToast.CloseButton
			data-cui={toastParts.closeButton}
			class={mergeClasses(toastStyles.closeButton(), local.class)}
			{...others}
		>
			{local.children ?? <CloseIcon aria-hidden="true" />}
		</KToast.CloseButton>
	);
}

export function ProgressTrack<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KToastProgressTrackProps<T> & { class?: string }>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", KToastProgressTrackProps>,
		["class"],
	);
	return (
		<KToast.ProgressTrack
			data-cui={toastParts.progressTrack}
			class={mergeClasses(toastStyles.progressTrack(), local.class)}
			{...others}
		/>
	);
}

export function ProgressFill<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, KToastProgressFillProps<T> & { class?: string }>,
) {
	const [local, others] = splitProps(
		props as PolymorphicProps<"div", KToastProgressFillProps>,
		["class", "style"],
	);
	return (
		<KToast.ProgressFill
			style={kobalteStyle(local.style)}
			data-cui={toastParts.progressFill}
			class={mergeClasses(toastStyles.progressFill(), local.class)}
			{...others}
		/>
	);
}

export type IconProps = JSX.HTMLAttributes<HTMLSpanElement>;

/** Decorative icon slot, hidden from assistive technology. Takes the tone color. */
export function Icon(props: IconProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<span
			aria-hidden="true"
			data-cui={toastParts.icon}
			class={mergeClasses(toastStyles.icon(), local.class)}
			{...others}
		/>
	);
}

export type ActionProps = JSX.ButtonHTMLAttributes<HTMLButtonElement>;

/** A small inline text button beside the message. */
export function Action(props: ActionProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<button
			type="button"
			data-cui={toastParts.action}
			class={mergeClasses(toastStyles.action(), local.class)}
			{...others}
		/>
	);
}
