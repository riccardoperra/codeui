import { Badge as KBadge, type BadgeRootProps as KBadgeRootProps } from "@kobalte/core/badge";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { type JSX, splitProps, type ValidComponent } from "solid-js";
import * as styles from "../components/Badge/Badge.css";
import { mergeClasses } from "../utils/css";

export const badgeParts = {
	root: "badge-root",
	icon: "badge-icon",
	label: "badge-label",
} as const;

export type BadgePart = keyof typeof badgeParts;
export type BadgeClasses = Partial<Record<BadgePart, string>>;
export type BadgeSize = "sm" | "md";
export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger";
export type BadgeVariant = "soft" | "outline";
export type BadgeVariants = { size?: BadgeSize; tone?: BadgeTone; variant?: BadgeVariant };

export type BadgeStyles = { [P in BadgePart]: (variants?: BadgeVariants) => string };

export const badgeStyles: BadgeStyles = {
	root: variants =>
		styles.root({ size: variants?.size, tone: variants?.tone, variant: variants?.variant }),
	icon: () => styles.icon,
	label: () => styles.label,
};

export type RootProps<T extends ValidComponent = "span"> = KBadgeRootProps<T> &
	BadgeVariants & { class?: string };

export function Root<T extends ValidComponent = "span">(props: PolymorphicProps<T, RootProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"span", RootProps>, [
		"class",
		"size",
		"tone",
		"variant",
	]);
	return (
		<KBadge
			data-cui={badgeParts.root}
			data-size={local.size ?? "sm"}
			data-tone={local.tone ?? "neutral"}
			data-variant={local.variant ?? "soft"}
			class={mergeClasses(
				badgeStyles.root({ size: local.size, tone: local.tone, variant: local.variant }),
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
			data-cui={badgeParts.icon}
			class={mergeClasses(badgeStyles.icon(), local.class)}
			{...others}
		/>
	);
}

export type LabelProps = JSX.HTMLAttributes<HTMLSpanElement>;

export function Label(props: LabelProps) {
	const [local, others] = splitProps(props, ["class"]);
	return (
		<span data-cui={badgeParts.label} class={mergeClasses(badgeStyles.label(), local.class)} {...others} />
	);
}
