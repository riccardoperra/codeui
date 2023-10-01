import { For } from "solid-js";
import { DemoSectionRow } from "~/components/ui/DemoSection";
import { Checkbox, CheckBoxProps, TextField, TextFieldProps } from "@codeui/kit";

export default function TextInputDemo() {
	return (
		<>
			<h1 class={"title"}>Checkbox</h1>

			<h2>Sizes</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as CheckBoxProps["size"][]}>
					{(size, index) => (
						<Checkbox
							name={`checkbox-${index()}`}
							value={"Subscribe"}
							label={"Subscribe"}
							size={size}
						/>
					)}
				</For>
			</DemoSectionRow>

			<h2>Validation</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{(size, index) => (
						<Checkbox
							name={`checkbox-validation-${index()}`}
							validationState={"invalid"}
							value={"Subscribe"}
							label={"Subscribe"}
							description={"You will receive our weekly newsletters"}
							errorMessage={"Value is not valid"}
							size={size}
						/>
					)}
				</For>
			</DemoSectionRow>
		</>
	);
}
