import {
	type Accessor,
	createContext,
	For,
	type JSX,
	Show,
	splitProps,
	useContext,
} from "solid-js";
import * as P from "../../parts/option-card";
import { mergeClasses } from "../../utils/css";

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
					<P.Preview class={cls("preview")}>{props.preview}</P.Preview>
				</Show>
				<span>{props.label}</span>
				<Show when={props.badge}>
					<P.Badge class={cls("badge")}>{props.badge}</P.Badge>
				</Show>
				<Show when={props.description}>
					<P.ItemDescription as="span" class={cls("itemDescription")}>
						{props.description}
					</P.ItemDescription>
				</Show>
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
	const [local, others] = splitProps(props, [
		"items",
		"onChange",
		"label",
		"description",
		"errorMessage",
		"classes",
		"class",
		"variant",
	]);
	const change = (value: string) => {
		const entry = local.items?.find(item => item.value === value);
		if (entry) local.onChange?.(entry.value);
	};
	return (
		<P.Root
			{...others}
			variant={local.variant}
			onChange={change}
			class={mergeClasses(local.classes?.root, local.class)}
		>
			<Show when={local.label}>
				<P.Label class={local.classes?.label}>{local.label}</P.Label>
			</Show>
			<Show when={local.description}>
				<P.Description class={local.classes?.description}>
					{local.description}
				</P.Description>
			</Show>
			<AppearanceContext.Provider
				value={() => ({ classes: local.classes, variant: local.variant })}
			>
				<For each={local.items}>{item => <OptionCard {...item} />}</For>
			</AppearanceContext.Provider>
			<Show when={local.errorMessage}>
				<P.ErrorMessage class={local.classes?.errorMessage}>
					{local.errorMessage}
				</P.ErrorMessage>
			</Show>
		</P.Root>
	);
}
