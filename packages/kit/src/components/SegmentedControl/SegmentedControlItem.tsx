import "@codeui/styles/theme.css";
import "@codeui/styles/segmentedcontrol.css";
import { onSettled, omit } from "solid-js";
import { ValidComponent } from "@solidjs/web";
import { mergeClasses } from "../../utils/css";
import * as styles from "./SegmentedControl.css";
import { Tabs, TabsTriggerProps } from "@kobalte/core/tabs";
import { useSegmentedControlContext } from "./SegmentedControlContext";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

export type SegmentedControlItemProps<T extends ValidComponent = "button"> =
	TabsTriggerProps<T>;

export function SegmentedControlItem<T extends ValidComponent = "button">(
	props: PolymorphicProps<T, SegmentedControlItemProps<T>>,
) {
	const local = props as PolymorphicProps<"button", SegmentedControlItemProps>;
	const others = omit(local, "class", "ref");
	const context = useSegmentedControlContext();
	let ref: HTMLElement;

	const classes = () => mergeClasses(styles.segment, local.class, context.itemClass?.());

	onSettled(() => {
		context.mountItem(ref);
		return () => context.unmountItem(ref);
	});

	return (
		<Tabs.Trigger
			data-cui={"segmentedcontrol-item"}
			class={classes()}
			ref={[local.ref, el => (ref = el)]}
			{...others}
		/>
	);
}
