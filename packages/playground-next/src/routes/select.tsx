import { createSelectOptions, Select, TextFieldProps } from "@codeui/kit";
import { createSignal, For, NoInfer } from "solid-js";
import { DemoSectionRow } from "~/components/ui/DemoSection";

interface Fruit {
	value: string;
	name: string;
	disabled: boolean;
}

const options: Fruit[] = [
	{ value: "apple", name: "Apple", disabled: false },
	{ value: "banana", name: "Banana", disabled: false },
	{ value: "blueberry", name: "Blueberry", disabled: false },
	{ value: "grapes", name: "Grapes", disabled: true },
	{ value: "pineapple", name: "Pineapple", disabled: false },
];

export default function SelectDemo() {
	const [state1, setState1] = createSignal<string>("apple");

	const selectOptions = createSelectOptions(options, { key: "name", valueKey: "value" });

	return (
		<div style={{ "min-height": "300px" }}>
			<h1 class={"title"}>Select</h1>
			<h2>Object items</h2>
			<button onClick={() => setState1("banana")}>Reset</button>
			<DemoSectionRow>
				<Select
					{...selectOptions.props()}
					{...selectOptions.controlled(state1, setState1)}
					aria-label={"Fruit"}
					size={"md"}
					value={state1()}
					onChange={setState1}
					optionValue="value"
					optionTextValue="label"
					itemLabel={props => props.label}
					valueComponent={value => value().label}
					options={selectOptions.options()}
				/>
			</DemoSectionRow>
			<h2>Filled</h2>
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
			<h2>Outline</h2>
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
			<h2>Inline</h2>
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
			<h2>With description</h2>
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
			<h2>Disabled</h2>
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
			<h2>Validation</h2>
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
		</div>
	);
}
