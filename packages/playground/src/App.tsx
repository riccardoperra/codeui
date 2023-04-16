import type { Component } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import { DialogDemo } from "./demo/Dialog";
import { TextInputDemo } from "./demo/TextInput";
import { DemoSection } from "./ui/DemoSection";
import { DropdownMenuDemo } from "./demo/DropdownMenu";
import { PopoverDemo } from "./demo/Popover";
import { SelectDemo } from "./demo/Select";
import "./App.css";
import { Button, theme as themeClass } from "@codeui/kit";
import { content, header } from "./App.css";
import { As, ToggleButton } from "@kobalte/core";
import { ButtonDemo } from "./demo/Button";
import { RadioInputDemo } from "./demo/Radio";

const App: Component = () => {
	const [theme, setTheme] = createSignal("dark");
	document.documentElement.classList.add(themeClass);

	createEffect(() => {
		document.documentElement.setAttribute("data-cui-theme", theme());
	});

	return (
		<div>
			<div class={header}>
				<ToggleButton.Root asChild>
					{state => (
						<As
							component={Button}
							size={"xs"}
							theme={"secondary"}
							onClick={() => setTheme(theme => (theme === "dark" ? "light" : "dark"))}
						>
							{state.isPressed() ? "Dark" : "Light"} theme
						</As>
					)}
				</ToggleButton.Root>
			</div>
			<div class={content}>
				<DemoSection>
					<ButtonDemo />
				</DemoSection>
				<DemoSection>
					<TextInputDemo />
				</DemoSection>
				<DemoSection>
					<RadioInputDemo />
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
		</div>
	);
};

export default App;
