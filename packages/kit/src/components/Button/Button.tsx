import { Button as KButton } from "@kobalte/core";
import { JSX, Show, splitProps } from "solid-js";
import * as styles from "./Button.css";
import { mergeClasses } from "../../utils/css";
import { ButtonIcon } from "./ButtonIcon";
import { Loading } from "./Loading";
import { Motion } from "@motionone/solid";
import { buttonLoadingWrapper, buttonText } from "./Button.css";

export type ButtonProps = KButton.ButtonRootProps &
	styles.ButtonVariants & {
		class?: string;
		leftIcon?: JSX.Element;
		loading?: boolean;
	};

export function Button(props: ButtonProps) {
	const [local, internal, others] = splitProps(
		props,
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
		<KButton.Root
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
			<span class={styles.buttonText}>
				<Show when={internal.leftIcon} keyed={false}>
					<ButtonIcon>{internal.leftIcon}</ButtonIcon>
				</Show>
				{internal.children}
			</span>
		</KButton.Root>
	);
}
