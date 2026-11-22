import { selectStyleProps } from "@codeui/styles/select";
import "@codeui/styles/theme.css";
import "@codeui/styles/select.css";
import * as K from "@kobalte/core/select";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { For, omit } from "solid-js";
import { type ValidComponent } from "@solidjs/web";
import type { BaseFieldProps } from "../components/Field/createBaseFieldProps";
import { baseFieldVariants } from "../components/Field/Field.css";
import { errorMessage } from "../components/Field/FieldError/FieldError.css";
import { label } from "../components/Field/FieldLabel/FieldLabel.css";
import { description } from "../components/Field/FieldMessage/FieldMessage.css";
import * as styles from "../components/Select/Select.css";
import { mergeClasses } from "../utils/css";
import { useNestedLayerMarker } from "../utils/layer-scope";
import { createPopMotion, motionRef, PopMotionContext } from "../utils/pop-motion";
import { keepCollectionScrollLocal } from "../utils/collection-scroll";

export const selectParts = {
	root: "select",
	label: "select-label",
	trigger: "select-trigger",
	value: "select-value",
	icon: "select-icon",
	description: "select-description",
	errorMessage: "select-error-message",
	content: "select-content",
	listbox: "select-listbox",
	item: "select-item",
	itemLabel: "select-item-label",
	itemIndicator: "select-item-indicator",
} as const;

export type SelectPart = keyof typeof selectParts;
export type SelectClasses = Partial<Record<SelectPart, string>>;

export type RootProps<
	Option,
	OptGroup = never,
	T extends ValidComponent = "div",
> = K.SelectRootProps<Option, OptGroup, T> & Pick<NonNullable<BaseFieldProps>, "size">;

export function Root<Option, OptGroup = never, T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<Option, OptGroup, T>>,
) {
	const local = props as PolymorphicProps<"div", RootProps<Option, OptGroup>>;
	const others = omit(local, "class", "size", "forceMount", "onOpenChange");
	const motion = createPopMotion(local);
	return (
		<PopMotionContext value={motion.setTarget}>
			<K.Root<Option, OptGroup>
				{...others}
				forceMount={motion.forceMount()}
				onOpenChange={motion.onOpenChange}
				data-cui={selectParts.root}
				class={mergeClasses(styles.field, local.class)}
				data-field-size={
					selectStyleProps.root({ fieldSize: local.size })["data-field-size"]
				}
			/>
		</PopMotionContext>
	);
}

export type TriggerProps<T extends ValidComponent = "button"> = K.SelectTriggerProps<T> &
	BaseFieldProps;

export function Trigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, TriggerProps<T>>,
) {
	const local = props as PolymorphicProps<"button", TriggerProps>;
	const others = omit(local, "class", "size", "variant");
	return (
		<K.Trigger
			{...others}
			data-cui={selectParts.trigger}
			data-size={selectStyleProps({ size: local.size })["data-size"]}
			data-variant={local.variant ?? "filled"}
			class={mergeClasses(baseFieldVariants(), styles.selectField, local.class)}
		/>
	);
}

export type ValueProps<Option, T extends ValidComponent = "span"> = K.SelectValueProps<
	Option,
	T
>;
export function Value<Option, T extends ValidComponent = "span">(
	props: PolymorphicProps<T, ValueProps<Option, T>>,
) {
	return <K.Value<Option, T> {...props} data-cui={selectParts.value} />;
}

export type ContentProps<T extends ValidComponent = "div"> = K.SelectContentProps<T>;
export function Content<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ContentProps<T>>,
) {
	const local = props as PolymorphicProps<"div", ContentProps>;
	const others = omit(local, "class", "ref");
	const nestedLayerMarker = useNestedLayerMarker();
	return (
		<K.Content
			{...others}
			ref={[motionRef(), local.ref]}
			data-cui={selectParts.content}
			data-kb-top-layer={nestedLayerMarker()}
			class={mergeClasses(styles.content, local.class)}
		/>
	);
}

export type ListboxProps<
	Option = unknown,
	OptGroup = never,
	T extends ValidComponent = "ul",
> = K.SelectListboxProps<Option, OptGroup, T>;
export function Listbox<
	Option = unknown,
	OptGroup = never,
	T extends ValidComponent = "ul",
>(props: PolymorphicProps<T, ListboxProps<Option, OptGroup, T>>) {
	return <K.Listbox<Option, OptGroup, T> {...props} data-cui={selectParts.listbox} />;
}

export type LabelProps<T extends ValidComponent = "span"> = K.SelectLabelProps<T>;
export function Label<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, LabelProps<T>>,
) {
	const local = props as PolymorphicProps<"span", LabelProps>;
	const others = omit(local, "class");
	return (
		<K.Label
			{...others}
			data-cui={selectParts.label}
			class={mergeClasses(local.class, label)}
		/>
	);
}

export type DescriptionProps<T extends ValidComponent = "div"> = K.SelectDescriptionProps;
export function Description<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, DescriptionProps<T>>,
) {
	const local = props as PolymorphicProps<"div", DescriptionProps>;
	const others = omit(local, "class");
	return (
		<K.Description
			{...others}
			data-cui={selectParts.description}
			class={mergeClasses(local.class, description)}
		/>
	);
}

export type ErrorMessageProps<T extends ValidComponent = "div"> =
	K.SelectErrorMessageProps<T>;
export function ErrorMessage<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ErrorMessageProps<T>>,
) {
	const local = props as PolymorphicProps<"div", ErrorMessageProps>;
	const others = omit(local, "class");
	return (
		<K.ErrorMessage
			{...others}
			data-cui={selectParts.errorMessage}
			class={mergeClasses(errorMessage, local.class)}
		/>
	);
}

export type IconProps<T extends ValidComponent = "span"> = K.SelectIconProps<T>;
export function Icon<T extends ValidComponent = "span">(
	props: PolymorphicProps<T, IconProps<T>>,
) {
	return <K.Icon<T> {...props} data-cui={selectParts.icon} />;
}

export type ItemProps<T extends ValidComponent = "li"> = K.SelectItemProps<T>;
export function Item<T extends ValidComponent = "li">(
	props: PolymorphicProps<T, ItemProps<T>>,
) {
	const local = props as PolymorphicProps<"li", ItemProps>;
	const others = omit(local, "class", "ref");
	return (
		<K.Item
			{...others}
			ref={[keepCollectionScrollLocal, local.ref]}
			data-cui={selectParts.item}
			class={mergeClasses(styles.item, local.class)}
		/>
	);
}

export type ItemLabelProps<T extends ValidComponent = "div"> = K.SelectItemLabelProps<T>;
export function ItemLabel<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemLabelProps<T>>,
) {
	return <K.ItemLabel<T> {...props} data-cui={selectParts.itemLabel} />;
}

export type ItemIndicatorProps<T extends ValidComponent = "div"> =
	K.SelectItemIndicatorProps<T>;
export function ItemIndicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemIndicatorProps<T>>,
) {
	return <K.ItemIndicator<T> {...props} data-cui={selectParts.itemIndicator} />;
}

export {
	Portal,
	Section,
	type SelectPortalProps as PortalProps,
	type SelectSectionProps as SectionProps,
} from "@kobalte/core/select";

export type FormValueProps = { name: string; disabled?: boolean };

/**
 * One hidden input per selected key, so `name` submits the value with a form.
 * Kobalte's `HiddenSelect` puts a focusable input inside `aria-hidden`, which axe reports.
 */
export function FormValue(props: FormValueProps) {
	const context = K.useSelectContext();
	return (
		<For each={[...context.listState().selectionManager().selectedKeys()]}>
			{key => (
				<input type="hidden" name={props.name} value={key} disabled={props.disabled} />
			)}
		</For>
	);
}
