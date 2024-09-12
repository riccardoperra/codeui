import { Button as KButton, ButtonRootProps as KButtonRootProps } from "@kobalte/core/button";
import { JSX, Show, splitProps, ValidComponent } from "solid-js";
import * as styles from "./Button.css";
import { mergeClasses } from "../../utils/css";
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
		["size", "theme", "pill", "block", "variant", "loading"],
		["class", "children", "leftIcon"],
	);

	const classes = () =>
		mergeClasses(
			styles.button({
				size: local.size,
				theme: local.theme,
				pill: local.pill,
				block: local.block,
				variant: local.variant,
				loading: local.loading,
			}),
			internal.class,
		);

	return (
		<KButton
			data-cui="button"
			data-theme={local.theme}
			data-size={local.size}
			data-loading={local.loading || undefined}
			class={classes()}
			{...others}
		>
			<Show when={props.loading}>
				<Loading />
			</Show>
			<Show when={internal.leftIcon} keyed={false}>
				<ButtonIcon>{internal.leftIcon}</ButtonIcon>
			</Show>
			{internal.children}
		</KButton>
	);
}
