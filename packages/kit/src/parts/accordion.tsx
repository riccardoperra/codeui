import { callHandler } from "@kobalte/utils";
import * as K from "@kobalte/core/accordion";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	createContext,
	createSignal,
	useContext,
	splitProps,
	type JSX,
	type ValidComponent,
} from "solid-js";
import { mergeClasses } from "../utils/css";
import * as styles from "../components/Accordion/Accordion.css";

export const accordionParts = {
	root: "accordion-root",
	item: "accordion-item",
	header: "accordion-header",
	trigger: "accordion-trigger",
	content: "accordion-content",
	icon: "accordion-icon",
	title: "accordion-title",
	summary: "accordion-summary",
	chevron: "accordion-chevron",
} as const;
export type AccordionPart = keyof typeof accordionParts;
export type AccordionClasses = Partial<Record<AccordionPart, string>>;
export type AccordionVariants = { density?: "compact" | "comfortable" };
export type AccordionStyles = Record<
	AccordionPart,
	(variants?: AccordionVariants) => string
>;
export const accordionStyles: AccordionStyles = {
	root: () => styles.root,
	item: () => styles.item,
	header: () => styles.header,
	trigger: variants => styles.trigger({ density: variants?.density }),
	content: () => styles.content,
	icon: () => styles.icon,
	title: () => styles.title,
	summary: () => styles.summary,
	chevron: () => styles.chevron,
};
export const useAccordionContext = K.useAccordionContext;
const ItemContext = createContext<() => boolean>(() => false);
export type RootProps<T extends ValidComponent = "div"> = K.AccordionRootProps<T> & {
	motion?: "auto" | "none";
};
export function Root<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", RootProps>, [
		"class",
		"motion",
		"onMouseDown",
		"onKeyDown",
	]);
	const [pointer, setPointer] = createSignal(false);
	return (
		<K.Root
			onMouseDown={event => {
				setPointer(true);
				callHandler(event, local.onMouseDown);
			}}
			onKeyDown={event => {
				setPointer(false);
				callHandler(event, local.onKeyDown);
			}}
			{...others}
			data-cui={accordionParts.root}
			data-motion={local.motion !== "none" && pointer() ? "auto" : "none"}
			class={mergeClasses(accordionStyles.root(), local.class)}
		/>
	);
}
export type ItemProps<T extends ValidComponent = "div"> = K.AccordionItemProps<T>;
export function Item<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", ItemProps>, [
		"class",
		"children",
	]);
	const context = K.useAccordionContext();
	const expanded = () => context.listState().selectionManager().isSelected(props.value);
	return (
		<K.Item
			{...others}
			data-cui={accordionParts.item}
			class={mergeClasses(accordionStyles.item(), local.class)}
		>
			<ItemContext.Provider value={expanded}>{local.children}</ItemContext.Provider>
		</K.Item>
	);
}
export type HeaderProps<T extends ValidComponent = "h3"> = K.AccordionHeaderProps<T>;
export function Header<T extends ValidComponent = "h3">(
	props: PolymorphicProps<T, HeaderProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"h3", HeaderProps>, [
		"class",
	]);
	return (
		<K.Header
			{...others}
			data-cui={accordionParts.header}
			class={mergeClasses(accordionStyles.header(), local.class)}
		/>
	);
}
export type TriggerProps<T extends ValidComponent = "button"> =
	K.AccordionTriggerProps<T>;
export function Trigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, TriggerProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"button", TriggerProps>, [
		"class",
		"onFocus",
	]);
	const context = K.useAccordionContext();
	return (
		<K.Trigger
			onFocus={event => {
				context.listState().selectionManager().setFocused(true);
				callHandler(event, local.onFocus);
			}}
			{...others}
			data-cui={accordionParts.trigger}
			class={mergeClasses(accordionStyles.trigger(), local.class)}
		/>
	);
}
export type ContentProps<T extends ValidComponent = "div"> = K.AccordionContentProps<T>;
export function Content<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ContentProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", ContentProps>, [
		"class",
	]);
	const expanded = useContext(ItemContext);
	return (
		<K.Content
			{...others}
			data-cui={accordionParts.content}
			class={mergeClasses(accordionStyles.content(), local.class)}
			inert={!expanded()}
			aria-hidden={!expanded()}
		/>
	);
}
export type IconProps = JSX.HTMLAttributes<HTMLSpanElement>;
export function Icon(props: IconProps) {
	const [local, others] = splitProps(props, ["class", "children"]);
	return (
		<span
			{...others}
			data-cui={accordionParts.icon}
			class={mergeClasses(accordionStyles.icon(), local.class)}
			aria-hidden="true"
		>
			{local.children}
		</span>
	);
}
export type TitleProps = JSX.HTMLAttributes<HTMLSpanElement>;
export function Title(props: TitleProps) {
	const [local, others] = splitProps(props, ["class", "children"]);
	return (
		<span
			{...others}
			data-cui={accordionParts.title}
			class={mergeClasses(accordionStyles.title(), local.class)}
		>
			{local.children}
		</span>
	);
}
export type SummaryProps = JSX.HTMLAttributes<HTMLSpanElement>;
export function Summary(props: SummaryProps) {
	const [local, others] = splitProps(props, ["class", "children"]);
	return (
		<span
			{...others}
			data-cui={accordionParts.summary}
			class={mergeClasses(accordionStyles.summary(), local.class)}
		>
			{local.children}
		</span>
	);
}
export type ChevronProps = JSX.HTMLAttributes<HTMLSpanElement>;
export function Chevron(props: ChevronProps) {
	const [local, others] = splitProps(props, ["class", "children"]);
	return (
		<span
			{...others}
			data-cui={accordionParts.chevron}
			class={mergeClasses(accordionStyles.chevron(), local.class)}
			aria-hidden="true"
		>
			{local.children ?? "⌄"}
		</span>
	);
}
