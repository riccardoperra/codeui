import { Tabs } from "@kobalte/core";
import * as styles from "./SegmentedControl.css";
import { SegmentedControlVariants } from "./SegmentedControl.css";
import { splitProps } from "solid-js";
import { mergeClasses } from "../../utils/css";
import { SlotProp } from "../../utils/component";

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
	SegmentedControlVariants &
	SlotProp<SegmentedControlSlot>;

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
	const disabled = () => (props.disabled ? "" : undefined);

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

	return (
		<Tabs.Root
			data-cui={"segmentedControl"}
			data-disabled={disabled()}
			activationMode={"manual"}
			orientation={"horizontal"}
			class={rootClasses()}
			{...props}
		>
			<Tabs.List
				data-cui={"segmentedControlList"}
				class={mergeClasses(styles.list, local.slotClasses?.list)}
			>
				{props.children}
				<Tabs.Indicator
					data-cui={"segmentedControlIndicator"}
					class={mergeClasses(styles.indicator, local.slotClasses?.indicator)}
				/>
			</Tabs.List>
		</Tabs.Root>
	);
}

type SegmentedControlItemProps = Tabs.TabsTriggerProps;

export function SegmentedControlItem<T>(props: SegmentedControlItemProps) {
	const [local, others] = splitProps(props, ["class"]);

	const classes = () => mergeClasses(styles.segment, local.class);

	return <Tabs.Trigger data-cui={"segmentedControlItem"} class={classes()} {...others} />;
}
