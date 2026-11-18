import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import { splitProps } from "solid-js";
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
	const [local, others] = splitProps(props, [
		"class",
		"slotClasses",
		"classes",
		"children",
	]);
	const [labelling, root] = splitProps(others, [
		"aria-label",
		"aria-labelledby",
		"aria-describedby",
	]);

	return (
		<P.Root
			{...root}
			class={mergeClasses(local.slotClasses?.root, local.classes?.root, local.class)}
			itemClass={local.classes?.item}
		>
			<P.List
				{...labelling}
				class={mergeClasses(local.slotClasses?.list, local.classes?.list)}
			>
				{local.children}
				<P.Indicator
					class={mergeClasses(local.slotClasses?.indicator, local.classes?.indicator)}
				/>
			</P.List>
		</P.Root>
	);
}
