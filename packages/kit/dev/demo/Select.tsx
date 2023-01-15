import { Select, SelectItem, TextFieldProps } from "@codeui/kit";
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
						>
							<For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
								{fruit => <SelectItem value={fruit}>{fruit}</SelectItem>}
							</For>
						</Select>
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
						>
							<For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
								{fruit => <SelectItem value={fruit}>{fruit}</SelectItem>}
							</For>
						</Select>
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
						>
							<For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
								{fruit => <SelectItem value={fruit}>{fruit}</SelectItem>}
							</For>
						</Select>
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
						>
							<For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
								{fruit => <SelectItem value={fruit}>{fruit}</SelectItem>}
							</For>
						</Select>
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
						>
							<For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
								{fruit => <SelectItem value={fruit}>{fruit}</SelectItem>}
							</For>
						</Select>
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							theme={theme}
							size={"md"}
							isReadOnly
						>
							<For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
								{fruit => <SelectItem value={fruit}>{fruit}</SelectItem>}
							</For>
						</Select>
						<Select
							label={"Select fruit"}
							aria-label={"Fruit"}
							theme={theme}
							size={"md"}
							isRequired
						>
							<For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
								{fruit => <SelectItem value={fruit}>{fruit}</SelectItem>}
							</For>
						</Select>
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
						>
							<For each={["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"]}>
								{fruit => <SelectItem value={fruit}>{fruit}</SelectItem>}
							</For>
						</Select>
					)}
				</For>
			</DemoSectionRow>
		</div>
	);
}
