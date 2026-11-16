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

export const toastParts = {
	region: "toast-region",
	list: "toast-list",
	root: "toast-root",
	title: "toast-title",
	description: "toast-description",
	closeButton: "toast-close-button",
	progressTrack: "toast-progress-track",
	progressFill: "toast-progress-fill",
	icon: "toast-icon",
	action: "toast-action",
} as const;

export type ToastPart = keyof typeof toastParts;
export type ToastClasses = Partial<Record<ToastPart, string>>;
export type ToastTone = "neutral" | "info" | "success" | "warning" | "danger";
export type ToastPosition =
	| "top-left"
	| "top-center"
	| "top-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right";
export type ToastVariants = { tone?: ToastTone; position?: ToastPosition };

export type ToastStyles = { [P in ToastPart]: (variants?: ToastVariants) => string };

export const toastStyles: ToastStyles = {
	region: variants => styles.region({ position: variants?.position }),
	list: () => styles.list,
	root: variants => styles.root({ tone: variants?.tone }),
	title: () => styles.title,
	description: () => styles.description,
	closeButton: () => styles.closeButton,
	progressTrack: () => styles.progressTrack,
	progressFill: () => styles.progressFill,
	icon: () => styles.icon,
	action: () => styles.action,
};

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
			class={mergeClasses(toastStyles.region({ position: local.position }), local.class)}
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
		"tone",
		"priority",
	]);
	return (
		<KToast
			as="div"
			data-cui={toastParts.root}
			data-tone={local.tone ?? "neutral"}
			priority={local.priority ?? (local.tone === "danger" ? "high" : "low")}
			class={mergeClasses(toastStyles.root({ tone: local.tone }), local.class)}
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
		["class"],
	);
	return (
		<KToast.ProgressFill
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
