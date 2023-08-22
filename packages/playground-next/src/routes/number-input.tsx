import { NumberField, NumberFieldProps } from "@codeui/kit";
import { For } from "solid-js";
import { DemoSectionRow } from "~/components/ui/DemoSection";

export default function NumberInputDemo() {
	return (
		<>
			{/*	Number Input */}
			<h1 class={"title"}>Number Input</h1>

			<h2>Sizes</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as NumberFieldProps["size"][]}>
					{size => <NumberField min={0} max={40} label={"Username"} size={size} />}
				</For>
			</DemoSectionRow>

			<h2>Digits after comma</h2>

			<DemoSectionRow>
				<NumberField precision={6} label={"Six precision"} size={"md"} />

				<NumberField precision={2} label={"Two precision"} size={"md"} />
			</DemoSectionRow>

			<h2>Prefix and postfix</h2>

			<DemoSectionRow>
				<NumberField
					precision={2}
					prefix={"$"}
					postfix={",00"}
					label={"Type a sum"}
					size={"md"}
				/>
			</DemoSectionRow>

			<h2>Steps</h2>

			<DemoSectionRow>
				<NumberField
					precision={2}
					step={0.1}
					prefix={"$"}
					postfix={",00"}
					label={"Type a sum"}
					size={"md"}
				/>
			</DemoSectionRow>
		</>
	);
}
