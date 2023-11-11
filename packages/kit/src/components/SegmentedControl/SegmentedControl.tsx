import { Tabs } from "@kobalte/core";
import { mergeRefs } from "@kobalte/utils";
import { debounce } from "@solid-primitives/scheduled";
import {
	Accessor,
	createContext,
	createSignal,
	onCleanup,
	onMount,
	splitProps,
	useContext,
} from "solid-js";
import { SlotProp } from "../../utils/component";
import { mergeClasses } from "../../utils/css";
import * as styles from "./SegmentedControl.css";
import { SegmentedControlVariants } from "./SegmentedControl.css";

type TypedTabsRootProps<T> = {
	value?: T;
	defaultValue?: T;
	onChange?: (value: T) => void;
};

type SegmentedControlProps = Omit<
	Tabs.TabsRootProps,
	"orientation" | keyof TypedTabsRootProps<string>
> &
	TypedTabsRootProps<string> &
	SegmentedControlVariants & { autoWidth?: boolean } & SlotProp<SegmentedControlSlot>;

type SegmentedControlSlot = "root" | "list" | "indicator";

interface SegmentedControlContextState {
	items: Accessor<HTMLElement[]>;

	mountItem(el: HTMLElement): void;

	unmountItem(el: HTMLElement): void;
}

const SegmentedControlContext = createContext<SegmentedControlContextState>();

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

	const [items, setItems] = createSignal<HTMLElement[]>([]);

	const context: SegmentedControlContextState = {
		items,
		mountItem(el) {
			setItems(items => items.concat(el));
		},
		unmountItem(el) {
			setItems(items => items.filter(item => item !== el));
		},
	};

	const handleListResize = debounce(() => {
		const selectedItem = items().find(item => item.hasAttribute("data-selected"));
		if (!selectedItem) {
			return;
		}
		indicatorRef.style.width = `${selectedItem.clientWidth}px`;
		indicatorRef.style.transform = `translateX(${selectedItem.offsetLeft}px)`;
	}, 50);

	onMount(() => {
		const resizeObserver = new ResizeObserver(handleListResize);
		resizeObserver.observe(listRef);
	});

	return (
		<SegmentedControlContext.Provider value={context}>
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

type SegmentedControlItemProps = Tabs.TabsTriggerProps;

export function SegmentedControlItem(props: SegmentedControlItemProps) {
	const [local, others] = splitProps(props, ["class"]);
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const context = useContext(SegmentedControlContext)!;
	let ref: HTMLElement;

	const classes = () => mergeClasses(styles.segment, local.class);

	onMount(() => {
		context.mountItem(ref);
		onCleanup(() => context.unmountItem(ref));
	});

	return (
		<Tabs.Trigger
			data-cui={"segmentedControlItem"}
			class={classes()}
			ref={mergeRefs(props.ref, el => (ref = el))}
			{...others}
		/>
	);
}
