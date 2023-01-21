import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { DialogDemo } from "./demo/Dialog";
import { ButtonDemo } from "./demo/Button";
import { TextInputDemo } from "./demo/TextInput";
import { DemoSection } from "./ui/DemoSection";
import { DropdownMenuDemo } from "./demo/DropdownMenu";
import { PopoverDemo } from "./demo/Popover";
import { SelectDemo } from "./demo/Select";
import "./App.css";
import { theme as themeClass } from "@codeui/kit";

const App: Component = () => {
	const [theme, setTheme] = createSignal("dark");
	document.documentElement.classList.add(themeClass);

	createEffect(() => {
		document.documentElement.setAttribute("data-cui-theme", theme());
	});

	return (
		<div>
			<input
				name={"theme"}
				type={"radio"}
				value={"light"}
				onChange={v => setTheme(v.currentTarget.value)}
			/>
			<input
				name={"theme"}
				type={"radio"}
				value={"dark"}
				onChange={v => setTheme(v.currentTarget.value)}
			/>

			<DemoSection>
				<ButtonDemo />
			</DemoSection>
			<DemoSection>
				<TextInputDemo />
			</DemoSection>
			<DemoSection>
				<SelectDemo />
			</DemoSection>
			<DemoSection>
				<DropdownMenuDemo />
			</DemoSection>
			<DemoSection>
				<DialogDemo />
			</DemoSection>
			<DemoSection>
				<PopoverDemo />
			</DemoSection>
		</div>
	);
};

export default App;
