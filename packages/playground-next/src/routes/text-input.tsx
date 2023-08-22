import { For } from "solid-js";
import { TextField, TextFieldLabel, TextFieldProps } from "@codeui/kit";
import { DemoSectionRow } from "~/components/ui/DemoSection";

export default function TextInputDemo() {
	return (
		<>
			{/*	Text Input */}
			<h1 class={"title"}>Text Input</h1>

			<h2>Sizes</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => <TextField value={"Username"} label={"Username"} size={size} />}
				</For>
			</DemoSectionRow>

			<h2>Outline</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextFieldProps["size"][]}>
					{size => (
						<TextField
							ref={el => (el.type = "number")}
							value={"Username"}
							theme={"outline"}
							label={"Username"}
							size={size}
						/>
					)}
				</For>
			</DemoSectionRow>

			<h2>Inline</h2>

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

			<h2>With custom label and description</h2>

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

			<h2>States</h2>

			<For each={["outline", "filled", "inline"] as TextFieldProps["theme"][]}>
				{theme => (
					<DemoSectionRow>
						<TextField
							placeholder={"Enter text..."}
							theme={theme}
							label={"Disabled input"}
							size={"md"}
							disabled
						/>
						<TextField
							placeholder={"Enter text..."}
							theme={theme}
							label={"Readonly input"}
							size={"md"}
							readOnly
						/>
						<TextField
							placeholder={"Enter text..."}
							theme={theme}
							label={"Required input"}
							size={"md"}
							required
						/>
					</DemoSectionRow>
				)}
			</For>

			<h2>Validation</h2>

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

			<h2>Custom</h2>

			<DemoSectionRow>
				<TextField
					defaultValue={"Centered"}
					label={"Label"}
					size={"md"}
					slotClasses={{
						input: "text-center",
						label: "font-italic",
					}}
				/>
			</DemoSectionRow>
		</>
	);
}
