import { mergeRefs } from "@kobalte/utils";
import { releaseEscape } from "../../utils/escape";
import { Tabs, TabsRootProps } from "@kobalte/core/tabs";
import { debounce } from "@solid-primitives/scheduled";
import { onCleanup, onMount, splitProps } from "solid-js";
import { SlotProp } from "../../utils/component";
import { mergeClasses } from "../../utils/css";
import { trackInputModality } from "../../utils/modality";
import * as styles from "./SegmentedControl.css";
import { SegmentedControlVariants } from "./SegmentedControl.css";
import {
	createSegmentedControlContextState,
	SegmentedControlContext,
} from "./SegmentedControlContext";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

type TypedTabsRootProps<T> = {
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
};

export type SegmentedControlProps = Omit<
	TabsRootProps,
	"orientation" | keyof TypedTabsRootProps<string>
> &
	TypedTabsRootProps<string> &
	SegmentedControlVariants & {
		autoWidth?: boolean;
		/** @deprecated Use classes. This alias remains until 1.0. */
		slotClasses?: SlotProp<SegmentedControlSlot>["slotClasses"];
		classes?: SegmentedControlClasses;
		onEscapeKeyDown?: (event: KeyboardEvent) => void;
	} & SlotProp<SegmentedControlSlot>;

export type SegmentedControlClasses = Partial<
	Record<"root" | "list" | "indicator" | "item", string>
>;

type SegmentedControlSlot = "root" | "list" | "indicator";

export function SegmentedControl(props: PolymorphicProps<"div", SegmentedControlProps>) {
	const [local, others] = splitProps(props, [
		"class",
		"theme",
		"fluid",
		"size",
		"variant",
		"pill",
		"slotClasses",
		"classes",
		"onEscapeKeyDown",
		"ref",
		"autoWidth",
	]);
	const [labelling, rest] = splitProps(others, [
		"aria-label",
		"aria-labelledby",
		"aria-describedby",
	]);

	let rootRef!: HTMLDivElement;
	let indicatorRef!: HTMLDivElement;
	let listRef!: HTMLDivElement;

	const disabled = () => (props.disabled ? "" : undefined);
	const autoWidth = () => (props.autoWidth ? "" : undefined);

	const rootClasses = () =>
		mergeClasses(
			local.slotClasses?.root,
			local.classes?.root,
			local.class,
			styles.segmentedControlWrapper({
				theme: local.theme ?? "neutral",
				size: local.size ?? "md",
				variant: local.variant ?? "solid",
				fluid: local.fluid,
				pill: local.pill,
			}),
		);

	const contextState = {
		...createSegmentedControlContextState(),
		itemClass: () => local.classes?.item,
	};

	const handleListResize = debounce(() => {
		const selectedControl = contextState
			.items()
			.find(item => item.hasAttribute("data-selected"));
		if (!selectedControl) {
			return;
		}
		indicatorRef.style.width = `${selectedControl.clientWidth}px`;
		indicatorRef.style.transform = `translateX(${selectedControl.offsetLeft}px)`;
	}, 0);

	onMount(() => {
		trackInputModality();
		onCleanup(releaseEscape(rootRef, event => local.onEscapeKeyDown?.(event)));
		if (!listRef) {
			return;
		}
		const resizeObserver = new ResizeObserver(handleListResize);
		resizeObserver.observe(listRef);
		onCleanup(() => resizeObserver.disconnect());
	});

	return (
		<SegmentedControlContext.Provider value={contextState}>
			<Tabs
				ref={mergeRefs(local.ref, el => (rootRef = el))}
				data-cui={"segmentedControl"}
				data-disabled={disabled()}
				data-autoWidth={autoWidth()}
				activationMode={"manual"}
				orientation={"horizontal"}
				class={rootClasses()}
				{...rest}
			>
				<Tabs.List
					{...labelling}
					data-cui={"segmentedControlList"}
					class={mergeClasses(styles.list, local.slotClasses?.list, local.classes?.list)}
					ref={listRef}
				>
					{props.children}
					<Tabs.Indicator
						data-cui={"segmentedControlIndicator"}
						class={mergeClasses(
							styles.indicator,
							local.slotClasses?.indicator,
							local.classes?.indicator,
						)}
						ref={indicatorRef}
					/>
				</Tabs.List>
			</Tabs>
		</SegmentedControlContext.Provider>
	);
}
