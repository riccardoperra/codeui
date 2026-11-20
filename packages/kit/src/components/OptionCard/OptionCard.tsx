import "@codeui/styles/theme.css";
import "@codeui/styles/optioncard.css";
import { type Accessor, createContext, For, Show, useContext, omit } from "solid-js";
import { type JSX } from "@solidjs/web";
import * as P from "../../parts/option-card";
import { mergeClasses } from "../../utils/css";
import * as styles from "./OptionCard.css";

export type OptionCardEntry<T extends string = string> = {
	value: T;
	label: JSX.Element;
	description?: JSX.Element;
	preview?: JSX.Element;
	badge?: JSX.Element;
	disabled?: boolean;
};
export type OptionCardProps<T extends string = string> = OptionCardEntry<T> &
	P.OptionCardVariants & {
		class?: string;
		classes?: P.OptionCardClasses;
	};
type Appearance = { classes?: P.OptionCardClasses; variant?: P.OptionCardVariant };
const AppearanceContext = createContext<Accessor<Appearance>>(() => ({}));

export function OptionCard<T extends string>(props: OptionCardProps<T>) {
	const parent = useContext(AppearanceContext);
	const variant = () => props.variant ?? parent().variant;
	const cls = (part: P.OptionCardPart) =>
		mergeClasses(parent().classes?.[part], props.classes?.[part]);
	return (
		<P.Item
			value={props.value}
			disabled={props.disabled}
			variant={variant()}
			class={mergeClasses(cls("item"), props.class)}
		>
			<P.ItemInput class={cls("itemInput")} />
			<P.ItemLabel variant={variant()} class={cls("itemLabel")}>
				<Show when={props.preview}>
					{preview => <P.Preview class={cls("preview")}>{preview()}</P.Preview>}
				</Show>
				<span class={styles.itemText}>
					<span class={styles.itemName}>
						<span>{props.label}</span>
						<Show when={props.badge}>
							{badge => <P.Badge class={cls("badge")}>{badge()}</P.Badge>}
						</Show>
					</span>
					<Show when={props.description}>
						{description => (
							<P.ItemDescription as="span" class={cls("itemDescription")}>
								{description()}
							</P.ItemDescription>
						)}
					</Show>
				</span>
			</P.ItemLabel>
		</P.Item>
	);
}

export type OptionCardGroupProps<T extends string = string> = Omit<
	P.RootProps,
	"value" | "defaultValue" | "onChange" | "children"
> & {
	items: readonly OptionCardEntry<T>[];
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
	label?: JSX.Element;
	description?: JSX.Element;
	errorMessage?: JSX.Element;
	classes?: P.OptionCardClasses;
	"aria-label"?: string;
	"aria-labelledby"?: string;
};

export function createOptionCardItems<T extends string>(
	items: Accessor<readonly OptionCardEntry<T>[]>,
) {
	return { items };
}

export function OptionCardGroup<T extends string>(props: OptionCardGroupProps<T>) {
	const others = omit(
		props,
		"items",
		"onChange",
		"label",
		"description",
		"errorMessage",
		"classes",
		"class",
		"variant",
	);
	const change = (value: string) => {
		const entry = props.items?.find(item => item.value === value);
		if (entry) props.onChange?.(entry.value);
	};
	return (
		<P.Root
			{...others}
			variant={props.variant}
			onChange={change}
			class={mergeClasses(props.classes?.root, props.class)}
		>
			<Show when={props.label}>
				{label => <P.Label class={props.classes?.label}>{label()}</P.Label>}
			</Show>
			<Show when={props.description}>
				{description => (
					<P.Description class={props.classes?.description}>
						{description()}
					</P.Description>
				)}
			</Show>
			<AppearanceContext
				value={() => ({ classes: props.classes, variant: props.variant })}
			>
				<For each={props.items}>{item => <OptionCard {...item} />}</For>
			</AppearanceContext>
			<Show when={props.validationState === "invalid" && props.errorMessage}>
				{errorMessage => (
					<P.ErrorMessage class={props.classes?.errorMessage}>
						{errorMessage()}
					</P.ErrorMessage>
				)}
			</Show>
		</P.Root>
	);
}
