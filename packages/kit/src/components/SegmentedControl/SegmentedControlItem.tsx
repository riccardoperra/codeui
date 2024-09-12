import { onCleanup, onMount, splitProps, ValidComponent } from "solid-js";
import { mergeClasses } from "../../utils/css";
import * as styles from "./SegmentedControl.css";
import { Tabs, TabsTriggerProps } from "@kobalte/core/tabs";
import { mergeRefs } from "@kobalte/utils";
import { useSegmentedControlContext } from "./SegmentedControlContext";
import { PolymorphicProps } from "@kobalte/core/polymorphic";

export type SegmentedControlItemProps<T extends ValidComponent = "button"> = TabsTriggerProps<T>;

export function SegmentedControlItem<T extends ValidComponent = "button">(props: PolymorphicProps<T, SegmentedControlItemProps<T>>) {
	const [local, others] = splitProps(props as PolymorphicProps<"button", SegmentedControlItemProps>, ["class"]);
	const context = useSegmentedControlContext();
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
