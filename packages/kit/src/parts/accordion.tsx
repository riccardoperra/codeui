import { accordionStyleProps } from "@codeui/styles/accordion";
import "@codeui/styles/theme.css";
import "@codeui/styles/accordion.css";
import { callHandler } from "@kobalte/utils";
import * as K from "@kobalte/core/accordion";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	createContext,
	createSignal,
	createUniqueId,
	createEffect,
	untrack,
	onSettled,
	useContext,
	omit,
} from "solid-js";
import { type JSX, type ValidComponent } from "@solidjs/web";
import { mergeClasses } from "../utils/css";
import * as styles from "../components/Accordion/Accordion.css";
import { trackInputModality } from "../utils/modality";

import {
	accordionParts,
	type AccordionPart,
	type AccordionClasses,
	type AccordionVariants,
	type AccordionStyles,
	accordionStyles,
} from "@codeui/styles/accordion";
export {
	accordionParts,
	type AccordionPart,
	type AccordionClasses,
	type AccordionVariants,
	type AccordionStyles,
	accordionStyles,
} from "@codeui/styles/accordion";
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
	const local = props as PolymorphicProps<"div", RootProps>;
	const others = omit(local, "class", "motion");
	// Keyboard toggles stay instant through `<html data-cui-input>`, which
	// only changes a transition and never restarts one.
	onSettled(trackInputModality);
	return (
		<K.Root
			{...others}
			data-cui={accordionParts.root}
			data-motion={local.motion ?? "auto"}
			class={mergeClasses(accordionStyles.root(), local.class)}
		/>
	);
}
export type ItemProps<T extends ValidComponent = "div"> = K.AccordionItemProps;
export function Item<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ItemProps<T>>,
) {
	const local = props as PolymorphicProps<"div", ItemProps>;
	const others = omit(local, "class", "children", "forceMount");
	const context = K.useAccordionContext();
	const expanded = () => context.listState().selectionManager().isSelected(props.value);
	const id = createUniqueId();
	const [closing, setClosing] = createSignal(untrack(expanded));
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
			<ItemContext value={item}>{local.children}</ItemContext>
		</K.Item>
	);
}
export type HeaderProps<T extends ValidComponent = "h3"> = K.AccordionHeaderProps<T>;
export function Header<T extends ValidComponent = "h3">(
	props: PolymorphicProps<T, HeaderProps<T>>,
) {
	const local = props as PolymorphicProps<"h3", HeaderProps>;
	const others = omit(local, "class");
	return (
		<K.Header
			{...others}
			data-cui={accordionParts.header}
			class={mergeClasses(accordionStyles.header(), local.class)}
		/>
	);
}
export type TriggerProps<T extends ValidComponent = "button"> =
	K.AccordionTriggerProps<T> & AccordionVariants;
export function Trigger<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, TriggerProps<T>>,
) {
	const local = props as PolymorphicProps<"button", TriggerProps>;
	const others = omit(local, "class", "density", "onFocus");
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
			data-density={accordionStyleProps({ density: local.density })["data-density"]}
			class={mergeClasses(accordionStyles.trigger(), local.class)}
		/>
	);
}
export type ContentProps<T extends ValidComponent = "div"> = K.AccordionContentProps<T>;
export function Content<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ContentProps<T>>,
) {
	const local = props as PolymorphicProps<"div", ContentProps>;
	const others = omit(local, "class", "children", "style", "ref");
	const item = useItem();
	const [element, setElement] = createSignal<HTMLElement>();
	const [body, setBody] = createSignal<HTMLDivElement>();
	const [height, setHeight] = createSignal(0);
	// `open` drives the transition. It trails `expanded` by one style flush on
	// open, so the body starts from 0, and it keeps a closing body mounted
	// until its transition ends.
	let expandedNow = untrack(item.expanded);
	const [open, setOpen] = createSignal(expandedNow);
	const setClosing = item.setClosing;
	const measure = (inner: HTMLDivElement) => setHeight(inner.scrollHeight);
	createEffect(body, inner => {
		if (!inner) return;
		measure(inner);
		if (typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(() => measure(inner));
		observer.observe(inner);
		return () => observer.disconnect();
	});
	// Solid replays the first value of an effect that reads staged state, so
	// `defer` would still run this on mount and mount every closed body. Act
	// only when `expanded` really changes.
	createEffect(item.expanded, expanded => {
		if (expanded === expandedNow) return;
		expandedNow = expanded;
		setClosing(true);
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
				const inner = body();
				if (inner) measure(inner);
				void content.offsetHeight;
				setOpen(true);
				return;
			}
			setOpen(false);
			if (!hasTransition(content)) setClosing(false);
		});
	});
	const finish = (event: TransitionEvent) => {
		if (event.target === event.currentTarget && !item.expanded()) setClosing(false);
	};
	return (
		<K.Content
			id={item.contentId}
			aria-labelledby={item.triggerId()}
			{...others}
			ref={[setElement, local.ref]}
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
			aria-hidden={item.expanded() ? "false" : "true"}
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
	const local = props;
	const others = omit(props, "class", "children");
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
	const local = props;
	const others = omit(props, "class", "children");
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
	const local = props;
	const others = omit(props, "class", "children");
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
	const local = props;
	const others = omit(props, "class", "children");
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
