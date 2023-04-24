import { createSelectOptions, Select, TextFieldProps } from "@codeui/kit";
import { createEffect, createSignal, For } from "solid-js";
import { DemoSectionRow } from "~/components/ui/DemoSection";

interface Fruit {
	value: string;
	label: string;
	disabled: boolean;
}

const options: Fruit[] = [
	{ value: "apple", label: "Apple", disabled: false },
	{ value: "banana", label: "Banana", disabled: false },
	{ value: "blueberry", label: "Blueberry", disabled: false },
	{ value: "grapes", label: "Grapes", disabled: true },
	{ value: "pineapple", label: "Pineapple", disabled: false },
];

export default function SelectDemo() {
	const [state1, setState1] = createSignal<any>("C");

	const selectOptions = createSelectOptions(options, { key: "label", valueKey: "value" });

	return (
		<div style={{ "min-height": "300px" }}>
			<h1 class={"title"}>Select</h1>
			<h2>Object items</h2>
			<DemoSectionRow>
				<Select
					{...selectOptions.props()}
					aria-label={"Fruit"}
					size={"md"}
					value={selectOptions.optionFromValue(state1())}
					options={selectOptions.options()}
					onChange={item => {
						setState1(selectOptions.optionToValue(item));
					}}
				/>
			</DemoSectionRow>
			;<h2>Filled</h2>;
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
			;<h2>Outline</h2>;
			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							size={size}
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						/>
					)}
				</For>
			</DemoSectionRow>
			;<h2>Inline</h2>;
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
			;<h2>With description</h2>;
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
			;<h2>Disabled</h2>;
			<For each={["outline", "filled", "inline"] as TextFieldProps["theme"][]}>
				{theme => (
					<DemoSectionRow>
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							theme={theme}
							size={"md"}
							disabled
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						/>
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							theme={theme}
							size={"md"}
							readOnly
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						/>
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							theme={theme}
							size={"md"}
							required
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						/>
					</DemoSectionRow>
				)}
			</For>
			;<h2>Validation</h2>;
			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<Select
							aria-label={"Fruit"}
							size={size}
							validationState={"invalid"}
							errorMessage={"Fruit is not valid"}
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						/>
					)}
				</For>
			</DemoSectionRow>
			;
		</div>
	);
}
