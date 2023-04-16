import { Select, TextFieldProps } from "@codeui/kit";
import { DemoSectionRow } from "../ui/DemoSection";
import { createSignal, For } from "solid-js";

export function SelectDemo() {
	const [state1, setState1] = createSignal<any>("C");

	return (
		<div style={{ "min-height": "300px" }}>
			<h1 class={"title"}>Select</h1>

			<h2>Object items</h2>

			<DemoSectionRow>
				<Select
					aria-label={"Fruit"}
					size={"md"}
					options={[
						{ label: "Apple", value: "A" },
						{ label: "Banana", value: "B" },
						{ label: "Blueberry", value: "C" },
					]}
					optionValue="value"
					optionTextValue="label"
					itemLabel={props => props.label}
					valueComponent={props => props.item.rawValue.label}
				/>
			</DemoSectionRow>

			<h2>Invalid items items</h2>

			<DemoSectionRow>
				<Select
					aria-label={"Fruit"}
					size={"md"}
					options={[
						{ label: "Apple", value: "A" },
						{ label: "Banana", value: "B" },
						{ label: "Blueberry", value: "C" },
					]}
					value={state1()}
					onValueChange={setState1}
					optionValue="value"
					optionTextValue="label"
					itemLabel={props => props.label}
					valueComponent={props => props.item.rawValue.label}
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
							theme={"outline"}
							size={size}
							options={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}
						></Select>
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

			<h2>Validation</h2>

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
