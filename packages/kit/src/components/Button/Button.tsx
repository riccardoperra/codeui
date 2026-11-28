import { pickProps } from "../../utils/pick-props";
import "@codeui/styles/theme.css";
import "@codeui/styles/button.css";
import {
	Button as KButton,
	ButtonRootProps as KButtonRootProps,
} from "@kobalte/core/button";
import { Show, omit } from "solid-js";
import { JSX, ValidComponent } from "@solidjs/web";
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

export function Button<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, ButtonProps<T>>,
) {
	const local = props as PolymorphicProps<"button", ButtonProps>;
	const internal = pickProps(
		local,
		"class",
		"children",
		"leftIcon",
		"onClick",
		"aria-disabled",
	);
	const others = omit(
		local,
		"size",
		"variant",
		"pill",
		"block",
		"ghost",
		"loading",
		"class",
		"children",
		"leftIcon",
		"onClick",
		"aria-disabled",
	);

	// Loading blocks activation without the disabled attribute, so a focused button keeps focus.
	const onClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = event => {
		if (local.loading) {
			event.preventDefault();
			event.stopImmediatePropagation();
			return;
		}
		const handler = internal.onClick as
			| JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
			| undefined;
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
			data-loading={local.loading ? "true" : undefined}
			{...others}
			aria-busy={local.loading ? "true" : undefined}
			aria-disabled={local.loading ? "true" : internal["aria-disabled"]}
			onClick={onClick}
		>
			<Show when={local.loading}>
				<Loading />
			</Show>
			<Show when={internal.leftIcon} keyed={false}>
				{leftIcon => <ButtonIcon>{leftIcon()}</ButtonIcon>}
			</Show>
			{internal.children}
		</KButton>
	);
}
