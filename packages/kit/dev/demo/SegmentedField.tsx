import { DemoSectionRow } from "../ui/DemoSection";
import { createEffect, createSignal, JSX } from "solid-js";
import { segmentedGroup } from "../../src/components/SegmentedField/SegmentedField.css";
import { SegmentedField, SegmentedFieldItem } from "@codeui/kit";

function ArrowRightIcon(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			{...props}
			width={"1.1em"}
			height={"1.1em"}
		>
			<path
				fill-rule="evenodd"
				d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
				clip-rule="evenodd"
			/>
		</svg>
	);
}

export function SegmentedFieldDemo() {
	const [value, setValue] = createSignal<string>("");

	createEffect(() => console.log(value(), "segmented field"));

	return (
		<div style={{ "min-height": "150x" }}>
			<h1 class={"title"}>SegmentedField</h1>

			<DemoSectionRow>
				<SegmentedField value={value()} onValueChange={setValue} class={segmentedGroup}>
					<SegmentedFieldItem value={"1"}>Item - 1</SegmentedFieldItem>
					<SegmentedFieldItem value={"2"}>Item - 2</SegmentedFieldItem>
					<SegmentedFieldItem value={"3"}>Item - 3</SegmentedFieldItem>
				</SegmentedField>
			</DemoSectionRow>
		</div>
	);
}
