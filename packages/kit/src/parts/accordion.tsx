import { callHandler, mergeRefs } from "@kobalte/utils";
import * as K from "@kobalte/core/accordion";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	createContext,
	createSignal,
	createUniqueId,
	createEffect,
	on,
	onCleanup,
	onMount,
	useContext,
	splitProps,
	type JSX,
	type ValidComponent,
} from "solid-js";
import { mergeClasses } from "../utils/css";
import * as styles from "../components/Accordion/Accordion.css";
import { trackInputModality } from "../utils/modality";

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
const ItemContext = createContext<{
	expanded: () => boolean;
	triggerId: () => string;
	contentId: string;
	/** Keeps a closing body mounted until its transition ends. */
	setClosing: (closing: boolean) => void;
}>();
function useItem() {
	const context = useContext(ItemContext);
	if (!context) throw new Error("Accordion parts require an Item");
	return context;
}
export type RootProps<T extends ValidComponent = "div"> = K.AccordionRootProps<T> & {
	motion?: "auto" | "none";
};
export function Root<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, RootProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", RootProps>, [
		"class",
		"motion",
	]);
	// Keyboard toggles stay instant through `<html data-cui-input>`, which
	// only changes a transition and never restarts one.
	onMount(trackInputModality);
	return (
		<K.Root
			{...others}
			data-cui={accordionParts.root}
			data-motion={local.motion ?? "auto"}
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
		"forceMount",
	]);
	const context = K.useAccordionContext();
	const expanded = () => context.listState().selectionManager().isSelected(props.value);
	const id = createUniqueId();
	const [closing, setClosing] = createSignal(false);
	const item = {
		expanded,
		triggerId: () => `cui-accordion-${id}-trigger`,
		contentId: `cui-accordion-${id}-content`,
		setClosing,
	};
	return (
		<K.Item
			{...others}
			forceMount={local.forceMount || closing()}
			data-cui={accordionParts.item}
			class={mergeClasses(accordionStyles.item(), local.class)}
		>
			<ItemContext.Provider value={item}>{local.children}</ItemContext.Provider>
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
	const item = useItem();
	const defaultTriggerId = item.triggerId;
	item.triggerId = () => props.id ?? defaultTriggerId();
	return (
		<K.Trigger
			id={item.triggerId()}
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
		"children",
		"style",
		"ref",
	]);
	const item = useItem();
	const [element, setElement] = createSignal<HTMLElement>();
	const [body, setBody] = createSignal<HTMLDivElement>();
	const [height, setHeight] = createSignal(0);
	// `open` drives the transition. It trails `expanded` by one style flush on
	// open, so the body starts from 0, and it keeps a closing body mounted
	// until its transition ends.
	const [open, setOpen] = createSignal(item.expanded());
	const setClosing = item.setClosing;
	const measure = () => {
		const inner = body();
		if (inner) setHeight(inner.scrollHeight);
	};
	createEffect(() => {
		const inner = body();
		if (!inner) return;
		measure();
		if (typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(measure);
		observer.observe(inner);
		onCleanup(() => observer.disconnect());
	});
	createEffect(
		on(
			item.expanded,
			expanded => {
				setClosing(!expanded);
				// Kobalte writes an inline `transition-duration: 0s` while it
				// measures a body it has just mounted; run after its effects.
				queueMicrotask(() => {
					const content = element();
					if (item.expanded() !== expanded) return;
					if (!content) {
						setOpen(expanded);
						setClosing(false);
						return;
					}
					content.style.transitionDuration = "";
					if (expanded) {
						measure();
						void content.offsetHeight;
						setOpen(true);
						return;
					}
					setOpen(false);
					if (!hasTransition(content)) setClosing(false);
				});
			},
			{ defer: true },
		),
	);
	const finish = (event: TransitionEvent) => {
		if (event.target === event.currentTarget && !item.expanded()) setClosing(false);
	};
	return (
		<K.Content
			id={item.contentId}
			aria-labelledby={item.triggerId()}
			{...others}
			ref={mergeRefs(setElement, local.ref)}
			style={
				typeof local.style === "string"
					? `${local.style}${height() ? `;--cui-accordion-content-height:${height()}px` : ""}`
					: {
							...local.style,
							"--cui-accordion-content-height": height() ? `${height()}px` : undefined,
						}
			}
			data-cui={accordionParts.content}
			data-open={open() ? "" : undefined}
			class={mergeClasses(accordionStyles.content(), local.class)}
			inert={!item.expanded()}
			aria-hidden={!item.expanded()}
			onTransitionEnd={finish}
			onTransitionCancel={finish}
		>
			<div ref={setBody} class={styles.contentBody}>
				{local.children}
			</div>
		</K.Content>
	);
}
function hasTransition(element: HTMLElement) {
	return getComputedStyle(element)
		.transitionDuration.split(",")
		.some(duration => parseFloat(duration) > 0);
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
			{local.children ?? "›"}
		</span>
	);
}
