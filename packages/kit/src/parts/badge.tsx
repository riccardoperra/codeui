import "@codeui/styles/theme.css";
import "@codeui/styles/badge.css";
import {
	Badge as KBadge,
	type BadgeRootProps as KBadgeRootProps,
} from "@kobalte/core/badge";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { omit } from "solid-js";
import { type JSX, type ValidComponent } from "@solidjs/web";
import * as styles from "../components/Badge/Badge.css";
import { mergeClasses } from "../utils/css";

import {
	badgeParts,
	type BadgePart,
	type BadgeClasses,
	type BadgeSize,
	type BadgeTone,
	type BadgeVariant,
	type BadgeVariants,
	type BadgeStyles,
	badgeStyles,
} from "@codeui/styles/badge";
export {
	badgeParts,
	type BadgePart,
	type BadgeClasses,
	type BadgeSize,
	type BadgeTone,
	type BadgeVariant,
	type BadgeVariants,
	type BadgeStyles,
	badgeStyles,
} from "@codeui/styles/badge";
export type RootProps<T extends ValidComponent = "span"> = KBadgeRootProps<T> &
	BadgeVariants & { class?: string };

export function Root<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const local = props as PolymorphicProps<"span", RootProps>;
	const others = omit(local, "class", "size", "tone", "variant");
	return (
		<KBadge
			data-cui={badgeParts.root}
			data-size={local.size ?? "sm"}
			data-tone={local.tone ?? "neutral"}
			data-variant={local.variant ?? "soft"}
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
			data-cui={badgeParts.icon}
			class={mergeClasses(badgeStyles.icon(), props.class)}
			{...others}
		/>
	);
}

export type LabelProps = JSX.HTMLAttributes<HTMLSpanElement>;

export function Label(props: LabelProps) {
	const others = omit(props, "class");
	return (
		<span
			data-cui={badgeParts.label}
			class={mergeClasses(badgeStyles.label(), props.class)}
			{...others}
		/>
	);
}
