import { For } from "solid-js";
import {
	RadioGroupItem,
	RadioList,
	TextField,
	TextFieldLabel,
	TextFieldProps,
} from "@codeui/kit";
import { DemoSectionRow } from "../ui/DemoSection";

export function RadioInputDemo() {
	return (
		<>
			{/*	Text Input */}
			<h1 class={"title"}>Radio Input</h1>

			<h2>Horizontal</h2>
			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<RadioList
							name={`radio-${size}`}
							description={"Description test"}
							label={"Username"}
							size={size}
						>
							<RadioGroupItem label={"Apple"} value={"Apple"} />
							<RadioGroupItem label={"Fruit"} value={"Fruit"} />
							<RadioGroupItem label={"Garden"} value={"Garden"} />
						</RadioList>
					)}
				</For>
			</DemoSectionRow>

			<h2>Vertical</h2>
			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<RadioList
							orientation={"vertical"}
							name={`radio-${size}`}
							description={"Description test"}
							label={"Username"}
							size={size}
						>
							<RadioGroupItem label={"Apple"} value={"Apple"} />
							<RadioGroupItem label={"Fruit"} value={"Fruit"} />
							<RadioGroupItem label={"Garden"} value={"Garden"} />
						</RadioList>
					)}
				</For>
			</DemoSectionRow>

			<h2>Validation</h2>
			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<RadioList
							orientation={"vertical"}
							name={`radio-${size}`}
							label={"Username"}
							value={"Apple"}
							size={size}
							validationState={"invalid"}
							errorMessage={"Invalid value"}
						>
							<RadioGroupItem label={"Apple"} value={"Apple"} />
							<RadioGroupItem label={"Fruit"} value={"Fruit"} />
							<RadioGroupItem label={"Garden"} value={"Garden"} />
						</RadioList>
					)}
				</For>
			</DemoSectionRow>
		</>
	);
}
