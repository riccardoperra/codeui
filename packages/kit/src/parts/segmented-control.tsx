import "@codeui/styles/theme.css";
import "@codeui/styles/segmentedcontrol.css";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
	Tabs,
	type TabsIndicatorProps,
	type TabsListProps,
	type TabsRootProps,
} from "@kobalte/core/tabs";
import { mergeRefs } from "@kobalte/utils";
import { debounce } from "@solid-primitives/scheduled";
import { onCleanup, onMount, splitProps, type ValidComponent } from "solid-js";
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
	const [local, others] = splitProps(props, [
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
	]);

	let rootRef!: HTMLDivElement;
	const contextState = {
		...createSegmentedControlContextState(),
		itemClass: () => local.itemClass,
	};

	onMount(() => {
		trackInputModality();
		onCleanup(releaseEscape(rootRef, event => local.onEscapeKeyDown?.(event)));
	});

	return (
		<SegmentedControlContext.Provider value={contextState}>
			<Tabs
				ref={mergeRefs(local.ref, el => (rootRef = el))}
				data-cui="segmentedcontrol"
				data-accent={local.accent ? "" : undefined}
				data-size={local.size ?? "sm"}
				data-variant={local.variant ?? "solid"}
				data-fluid={local.fluid || undefined}
				data-pill={local.pill || undefined}
				data-disabled={props.disabled ? "" : undefined}
				data-auto-width={local.autoWidth ? "" : undefined}
				activationMode="manual"
				orientation="horizontal"
				class={mergeClasses(local.class, styles.segmentedControlWrapper())}
				{...others}
			/>
		</SegmentedControlContext.Provider>
	);
}

export type ListProps<T extends ValidComponent = "div"> = TabsListProps<T>;

export function List<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, ListProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", ListProps>, [
		"class",
		"ref",
	]);
	const context = useSegmentedControlContext();
	let listRef!: HTMLDivElement;

	const handleResize = debounce(() => {
		const selected = context.items().find(item => item.hasAttribute("data-selected"));
		const indicator = context.indicator();
		if (!selected || !indicator) return;
		indicator.style.width = `${selected.clientWidth}px`;
		indicator.style.transform = `translateX(${selected.offsetLeft}px)`;
	}, 0);

	onMount(() => {
		const observer = new ResizeObserver(handleResize);
		observer.observe(listRef);
		onCleanup(() => {
			observer.disconnect();
			handleResize.clear();
		});
	});

	return (
		<Tabs.List
			{...others}
			data-cui="segmentedcontrol-list"
			class={mergeClasses(styles.list, local.class)}
			ref={mergeRefs(local.ref, el => (listRef = el))}
		/>
	);
}

export type IndicatorProps<T extends ValidComponent = "div"> = TabsIndicatorProps<T>;

export function Indicator<T extends ValidComponent = "div">(
	props: PolymorphicProps<T, IndicatorProps<T>>,
) {
	const [local, others] = splitProps(props as PolymorphicProps<"div", IndicatorProps>, [
		"class",
		"ref",
	]);
	const context = useSegmentedControlContext();
	let indicatorRef!: HTMLDivElement;

	onMount(() => {
		context.setIndicator(indicatorRef);
		onCleanup(() =>
			context.setIndicator(current => (current === indicatorRef ? undefined : current)),
		);
	});

	return (
		<Tabs.Indicator
			{...others}
			data-cui="segmentedcontrol-indicator"
			class={mergeClasses(styles.indicator, local.class)}
			ref={mergeRefs(local.ref, el => (indicatorRef = el))}
		/>
	);
}
