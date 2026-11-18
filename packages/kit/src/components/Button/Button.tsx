import "@codeui/styles/theme.css";
import "@codeui/styles/button.css";
import { Button as KButton, ButtonRootProps as KButtonRootProps } from "@kobalte/core/button";
import { JSX, Show, splitProps, ValidComponent } from "solid-js";
import * as styles from "./Button.css";
import { ButtonIcon } from "./ButtonIcon";
import { Loading } from "./Loading";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

export type ButtonProps<T extends ValidComponent = "button"> = KButtonRootProps<T> &
	styles.ButtonVariants & {
	class?: string;
	leftIcon?: JSX.Element;
	loading?: boolean;
};

export function Button<T extends ValidComponent = "button">(props: PolymorphicProps<T, ButtonProps<T>>) {
	const [local, internal, others] = splitProps(
		props as PolymorphicProps<"button", ButtonProps>,
		["size", "variant", "pill", "block", "ghost", "loading"],
		["class", "children", "leftIcon", "onClick", "aria-disabled"],
	);

	// Loading blocks activation without the disabled attribute, so a focused button keeps focus.
	const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = event => {
		if (local.loading) {
			event.preventDefault();
			event.stopImmediatePropagation();
			return;
		}
		const handler = internal.onClick as JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> | undefined;
		if (typeof handler === "function") handler(event);
		else if (handler) handler[0](handler[1], event);
	};

	return (
		<KButton
			{...styles.buttonStyleProps({
				size: local.size,
				variant: local.variant,
				ghost: local.ghost,
				pill: local.pill,
				block: local.block,
				class: internal.class,
			})}
			data-loading={local.loading || undefined}
			{...others}
			aria-busy={local.loading || undefined}
			aria-disabled={local.loading || internal["aria-disabled"] || undefined}
			onClick={onClick}
		>
			<Show when={local.loading}>
				<Loading />
			</Show>
			<Show when={internal.leftIcon} keyed={false}>
				{leftIcon => (
					<ButtonIcon>{leftIcon()}</ButtonIcon>
				)}
			</Show>
			{internal.children}
		</KButton>
	);
}
