import { Tabs } from "@kobalte/core";
import { debounce } from "@solid-primitives/scheduled";
import { onMount, splitProps } from "solid-js";
import { SlotProp } from "../../utils/component";
import { mergeClasses } from "../../utils/css";
import * as styles from "./SegmentedControl.css";
import { SegmentedControlVariants } from "./SegmentedControl.css";
import {
	createSegmentedControlContextState,
	SegmentedControlContext,
} from "./SegmentedControlContext";

type TypedTabsRootProps<T> = {
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
};

export type SegmentedControlProps = Omit<
	Tabs.TabsRootProps,
	"orientation" | keyof TypedTabsRootProps<string>
> &
	TypedTabsRootProps<string> &
	SegmentedControlVariants & { autoWidth?: boolean } & SlotProp<SegmentedControlSlot>;

type SegmentedControlSlot = "root" | "list" | "indicator";

export function SegmentedControl(props: SegmentedControlProps) {
	const [local, others] = splitProps(props, [
		"class",
		"theme",
		"fluid",
		"size",
		"variant",
		"pill",
		"slotClasses",
		"class",
	]);

	let indicatorRef!: HTMLDivElement;
	let listRef!: HTMLDivElement;

	const disabled = () => (props.disabled ? "" : undefined);
	const autoWidth = () => (props.autoWidth ? "" : undefined);

	const rootClasses = () =>
		mergeClasses(
			local.slotClasses?.root,
			local.class,
			styles.segmentedControlWrapper({
				theme: local.theme ?? "neutral",
				size: local.size,
				variant: local.variant ?? "solid",
				fluid: local.fluid,
				pill: local.pill,
			}),
		);

	const contextState = createSegmentedControlContextState();

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
		if (!listRef) {
			return;
		}
		const resizeObserver = new ResizeObserver(handleListResize);
		resizeObserver.observe(listRef);
	});

	return (
		<SegmentedControlContext.Provider value={contextState}>
			<Tabs.Root
				data-cui={"segmentedControl"}
				data-disabled={disabled()}
				data-autoWidth={autoWidth()}
				activationMode={"manual"}
				orientation={"horizontal"}
				class={rootClasses()}
				{...others}
			>
				<Tabs.List
					data-cui={"segmentedControlList"}
					class={mergeClasses(styles.list, local.slotClasses?.list)}
					ref={listRef}
				>
					{props.children}
					<Tabs.Indicator
						data-cui={"segmentedControlIndicator"}
						class={mergeClasses(styles.indicator, local.slotClasses?.indicator)}
						ref={indicatorRef}
					/>
				</Tabs.List>
			</Tabs.Root>
		</SegmentedControlContext.Provider>
	);
}
