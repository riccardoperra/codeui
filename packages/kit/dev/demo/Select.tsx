import { Select, TextFieldProps } from "@codeui/kit";
import { DemoSectionRow } from "../ui/DemoSection";
import { createSignal, For } from "solid-js";

export function SelectDemo() {
	const [open, setOpen] = createSignal(false);

	return (
		<div style={{ "min-height": "300px" }}>
			<h1 class={"title"}>Select</h1>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							size={size}
							theme={"filled"}
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						/>
					)}
				</For>
			</DemoSectionRow>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							theme={"outline"}
							size={size}
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						></Select>
					)}
				</For>
			</DemoSectionRow>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							theme={"inline"}
							size={size}
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						/>
					)}
				</For>
			</DemoSectionRow>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							theme={"inline"}
							size={size}
							description={"Select your favourite fruit"}
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						/>
					)}
				</For>
			</DemoSectionRow>

			<For each={["outline", "filled", "inline"] as TextFieldProps["theme"][]}>
				{theme => (
					<DemoSectionRow>
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							theme={theme}
							size={"md"}
							isDisabled
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						/>
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							theme={theme}
							size={"md"}
							isReadOnly
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						/>
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							theme={theme}
							size={"md"}
							isRequired
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						/>
					</DemoSectionRow>
				)}
			</For>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<Select
							aria-label={"Fruit"}
							theme={"outline"}
							size={size}
							validationState={"invalid"}
							errorMessage={"Fruit is not valid"}
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						/>
					)}
				</For>
			</DemoSectionRow>
		</div>
	);
}
