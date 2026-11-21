import { pickProps } from "../../utils/pick-props";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { omit } from "solid-js";
import * as P from "../../parts/segmented-control";
import type { SlotProp } from "../../utils/component";
import { mergeClasses } from "../../utils/css";

export type SegmentedControlProps = Omit<P.RootProps, "itemClass"> & {
	/** @deprecated Use classes. This alias remains until 1.0. */
	slotClasses?: SlotProp<SegmentedControlSlot>["slotClasses"];
	classes?: SegmentedControlClasses;
} & SlotProp<SegmentedControlSlot>;

export type SegmentedControlClasses = Partial<
	Record<"root" | "list" | "indicator" | "item", string>
>;

type SegmentedControlSlot = "root" | "list" | "indicator";

export function SegmentedControl(props: PolymorphicProps<"div", SegmentedControlProps>) {
	const others = omit(props, "class", "slotClasses", "classes", "children");
	const labelling = pickProps(
		others,
		"aria-label",
		"aria-labelledby",
		"aria-describedby",
	);
	const root = omit(others, "aria-label", "aria-labelledby", "aria-describedby");

	return (
		<P.Root
			{...root}
			class={mergeClasses(props.slotClasses?.root, props.classes?.root, props.class)}
			itemClass={props.classes?.item}
		>
			<P.List
				{...labelling}
				class={mergeClasses(props.slotClasses?.list, props.classes?.list)}
			>
				{props.children}
				<P.Indicator
					class={mergeClasses(props.slotClasses?.indicator, props.classes?.indicator)}
				/>
			</P.List>
		</P.Root>
	);
}
