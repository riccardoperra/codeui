import "@codeui/styles/theme.css";
import "@codeui/styles/avatar.css";
import { createSignal, omit, Show } from "solid-js";
import { type JSX } from "@solidjs/web";
import * as styles from "../components/Avatar/Avatar.css";
import { mergeClasses } from "../utils/css";

import { avatarParts, type AvatarVariants } from "@codeui/styles/avatar";
export {
	avatarParts,
	avatarHue,
	avatarInitials,
	avatarStyles,
	type AvatarPart,
	type AvatarClasses,
	type AvatarSize,
	type AvatarVariants,
	type AvatarStyles,
} from "@codeui/styles/avatar";

export type RootProps = JSX.HTMLAttributes<HTMLSpanElement> &
	AvatarVariants & {
		/** Hue of the fill in degrees. Derive it from a stable id with `avatarHue`, never from the name. */
		hue?: number;
	};

/** The circle. Give it `role="img"` and the person's name as `aria-label`. */
export function Root(props: RootProps) {
	const others = omit(props, "class", "size", "unassigned", "hue", "style");
	return (
		<span
			data-cui={avatarParts.root}
			data-size={props.size ?? "xs"}
			data-unassigned={props.unassigned ? "" : undefined}
			class={mergeClasses(styles.root(), props.class)}
			style={{
				...(typeof props.style === "object" ? props.style : {}),
				...(props.hue === undefined
					? { "--cui-avatar-chroma": "0" }
					: { "--cui-avatar-hue": String(props.hue) }),
			}}
			{...others}
		/>
	);
}

export type ImageProps = JSX.ImgHTMLAttributes<HTMLImageElement>;

/**
 * The picture. It covers the fallback while it loads and removes itself when it fails,
 * so the initials show instead.
 */
export function Image(props: ImageProps) {
	const [failed, setFailed] = createSignal(false);
	const others = omit(props, "class", "onError", "alt");
	return (
		<Show when={props.src && !failed()}>
			<img
				alt={props.alt ?? ""}
				{...others}
				data-cui={avatarParts.image}
				class={mergeClasses(styles.image(), props.class)}
				onError={event => {
					setFailed(true);
					if (typeof props.onError === "function")
						(props.onError as (event: Event) => void)(event);
				}}
			/>
		</Show>
	);
}

export type FallbackProps = JSX.HTMLAttributes<HTMLSpanElement>;

/** The initials. Hidden from assistive technology: the root carries the name. */
export function Fallback(props: FallbackProps) {
	const others = omit(props, "class");
	return (
		<span
			aria-hidden="true"
			{...others}
			data-cui={avatarParts.fallback}
			class={mergeClasses(styles.fallback(), props.class)}
		/>
	);
}
