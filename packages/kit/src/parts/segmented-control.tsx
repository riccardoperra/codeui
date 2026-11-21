import "@codeui/styles/theme.css";
import "@codeui/styles/segmentedcontrol.css";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	Tabs,
	type TabsIndicatorProps,
	type TabsListProps,
	type TabsRootProps,
} from "@kobalte/core/tabs";
import { debounce } from "@solid-primitives/scheduled";
import { onSettled, omit } from "solid-js";
import { type ValidComponent } from "@solidjs/web";
import * as styles from "../components/SegmentedControl/SegmentedControl.css";
import {
	createSegmentedControlContextState,
	SegmentedControlContext,
	useSegmentedControlContext,
} from "../components/SegmentedControl/SegmentedControlContext";
import { mergeClasses } from "../utils/css";
import { releaseEscape } from "../utils/escape";
import { trackInputModality } from "../utils/modality";

export {
	SegmentedControlItem as Item,
	type SegmentedControlItemProps as ItemProps,
} from "../components/SegmentedControl/SegmentedControlItem";

export type RootProps = Omit<TabsRootProps, "orientation"> &
	styles.SegmentedControlVariants & {
		autoWidth?: boolean;
		onEscapeKeyDown?: (event: KeyboardEvent) => void;
		itemClass?: string;
	};

export function Root(props: PolymorphicProps<"div", RootProps>) {
	const others = omit(
		props,
		"class",
		"accent",
		"fluid",
		"size",
		"variant",
		"pill",
		"onEscapeKeyDown",
		"ref",
		"autoWidth",
		"itemClass",
	);

	let rootRef!: HTMLDivElement;
	const contextState = {
		...createSegmentedControlContextState(),
		itemClass: () => props.itemClass,
	};

	onSettled(() => {
		trackInputModality();
		return releaseEscape(rootRef, event => props.onEscapeKeyDown?.(event));
	});

	return (
		<SegmentedControlContext value={contextState}>
			<Tabs
				ref={[props.ref, (el: HTMLDivElement) => (rootRef = el)]}
				data-cui="segmentedcontrol"
				data-accent={props.accent ? "" : undefined}
				data-size={props.size ?? "sm"}
				data-variant={props.variant ?? "solid"}
				data-fluid={props.fluid || undefined}
				data-pill={props.pill || undefined}
				data-disabled={props.disabled ? "" : undefined}
				data-auto-width={props.autoWidth ? "" : undefined}
				activationMode="manual"
				orientation="horizontal"
				class={mergeClasses(props.class, styles.segmentedControlWrapper())}
				{...others}
			/>
		</SegmentedControlContext>
	);
}

export type ListProps<T extends ValidComponent = "div"> = TabsListProps<T>;

export function List<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ListProps<T>>,
) {
	const local = props as PolymorphicProps<"div", ListProps>;
	const others = omit(local, "class", "ref");
	const context = useSegmentedControlContext();
	let listRef!: HTMLDivElement;

	const handleResize = debounce(() => {
		const selected = context.items().find(item => item.hasAttribute("data-selected"));
		const indicator = context.indicator();
		if (!selected || !indicator) return;
		indicator.style.width = `${selected.clientWidth}px`;
		indicator.style.transform = `translateX(${selected.offsetLeft}px)`;
	}, 0);

	onSettled(() => {
		const observer = new ResizeObserver(handleResize);
		observer.observe(listRef);
		return () => {
			observer.disconnect();
			handleResize.clear();
		};
	});

	return (
		<Tabs.List
			{...others}
			data-cui="segmentedcontrol-list"
			class={mergeClasses(styles.list, local.class)}
			ref={[local.ref, (el: HTMLDivElement) => (listRef = el)]}
		/>
	);
}

export type IndicatorProps<T extends ValidComponent = "div"> = TabsIndicatorProps<T>;

export function Indicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, IndicatorProps<T>>,
) {
	const local = props as PolymorphicProps<"div", IndicatorProps>;
	const others = omit(local, "class", "ref");
	const context = useSegmentedControlContext();
	let indicatorRef!: HTMLDivElement;

	onSettled(() => {
		context.setIndicator(indicatorRef);
		return () => {
			context.setIndicator(current => (current === indicatorRef ? undefined : current));
		};
	});

	return (
		<Tabs.Indicator
			{...others}
			data-cui="segmentedcontrol-indicator"
			class={mergeClasses(styles.indicator, local.class)}
			ref={[local.ref, (el: HTMLDivElement) => (indicatorRef = el)]}
		/>
	);
}
