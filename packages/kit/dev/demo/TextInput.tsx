import { For } from "solid-js";
import { TextField, TextFieldLabel, TextFieldProps } from "@codeui/kit";
import { DemoSectionRow } from "../ui/DemoSection";

export function TextInputDemo() {
	return (
		<>
			{/*	Text Input */}
			<h1 class={"title"}>Text Input</h1>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => <TextField value={"Username"} label={"Username"} size={size} />}
				</For>
			</DemoSectionRow>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<TextField
							value={"Username"}
							theme={"outline"}
							label={"Username"}
							size={size}
						/>
					)}
				</For>
			</DemoSectionRow>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<TextField
							value={"Username"}
							theme={"inline"}
							label={"Username"}
							size={size}
						/>
					)}
				</For>
			</DemoSectionRow>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<TextField
							value={"Username"}
							description={"Your username is description"}
							label={<TextFieldLabel>Username</TextFieldLabel>}
							size={size}
						/>
					)}
				</For>
			</DemoSectionRow>

			<For each={["outline", "filled", "inline"] as TextFieldProps["theme"][]}>
				{theme => (
					<DemoSectionRow>
						<TextField
							placeholder={"Enter text..."}
							theme={theme}
							label={"Disabled input"}
							size={"md"}
							isDisabled
						/>
						<TextField
							placeholder={"Enter text..."}
							theme={theme}
							label={"Readonly input"}
							size={"md"}
							isReadOnly
						/>
						<TextField
							placeholder={"Enter text..."}
							theme={theme}
							label={"Required input"}
							size={"md"}
							isRequired
						/>
					</DemoSectionRow>
				)}
			</For>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<TextField
							validationState={"invalid"}
							value={"Username"}
							label={"Username"}
							errorMessage={"Username is not valid"}
							size={size}
						/>
					)}
				</For>
			</DemoSectionRow>
		</>
	);
}
