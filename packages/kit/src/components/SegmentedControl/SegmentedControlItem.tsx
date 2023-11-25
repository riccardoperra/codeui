import { onCleanup, onMount, splitProps } from "solid-js";
import { mergeClasses } from "../../utils/css";
import * as styles from "./SegmentedControl.css";
import { Tabs } from "@kobalte/core";
import { mergeRefs } from "@kobalte/utils";
import { useSegmentedControlContext } from "./SegmentedControlContext";

export type SegmentedControlItemProps = Tabs.TabsTriggerProps;

export function SegmentedControlItem(props: SegmentedControlItemProps) {
	const [local, others] = splitProps(props, ["class"]);
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
