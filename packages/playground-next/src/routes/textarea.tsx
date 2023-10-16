import { For } from "solid-js";
import { TextArea, TextAreaLabel, TextAreaProps } from "@codeui/kit";
import { DemoSectionRow } from "~/components/ui/DemoSection";

export default function TextInputDemo() {
	return (
		<>
			{/*	Text Input */}
			<h1 class={"title"}>Text Area</h1>

			<h2>Sizes</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextAreaProps["size"][]}>
					{size => (
						<TextArea
							options={{ autoResize: true }}
							value={"Username"}
							label={"Username"}
							size={size}
						/>
					)}
				</For>
			</DemoSectionRow>

			<h2>Outline</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextAreaProps["size"][]}>
					{size => (
						<TextArea
							value={"Username"}
							theme={"outline"}
							options={{ autoResize: true }}
							label={"Username"}
							size={size}
						/>
					)}
				</For>
			</DemoSectionRow>

			<h2>Inline</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextAreaProps["size"][]}>
					{size => (
						<TextArea
							value={"Username"}
							theme={"inline"}
							options={{ autoResize: true }}
							label={"Username"}
							size={size}
						/>
					)}
				</For>
			</DemoSectionRow>

			<h2>With custom label and description</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextAreaProps["size"][]}>
					{size => (
						<TextArea
							value={"Username"}
							options={{ autoResize: true }}
							description={"Your username is description"}
							label={<TextAreaLabel>Username</TextAreaLabel>}
							size={size}
						/>
					)}
				</For>
			</DemoSectionRow>

			<h2>States</h2>

			<For each={["outline", "filled", "inline"] as TextAreaProps["theme"][]}>
				{theme => (
					<DemoSectionRow>
						<TextArea
							placeholder={"Enter text..."}
							theme={theme}
							options={{ autoResize: true }}
							label={"Disabled input"}
							size={"md"}
							disabled
						/>
						<TextArea
							placeholder={"Enter text..."}
							theme={theme}
							options={{ autoResize: true }}
							label={"Readonly input"}
							size={"md"}
							readOnly
						/>
						<TextArea
							placeholder={"Enter text..."}
							theme={theme}
							options={{ autoResize: true }}
							label={"Required input"}
							size={"md"}
							required
						/>
					</DemoSectionRow>
				)}
			</For>

			<h2>Validation</h2>

			<DemoSectionRow>
				<For each={["xs", "sm", "md", "lg", "xl"] as TextAreaProps["size"][]}>
					{size => (
						<TextArea
							validationState={"invalid"}
							value={"Username"}
							options={{ autoResize: true }}
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
