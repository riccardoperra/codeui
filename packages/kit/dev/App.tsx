import type { Component } from "solid-js";
import { theme } from "@codeui/kit";
import { DialogDemo } from "./demo/Dialog";
import { ButtonDemo } from "./demo/Button";
import { TextInputDemo } from "./demo/TextInput";
import { DemoSection } from "./ui/DemoSection";
import { DropdownMenuDemo } from "./demo/DropdownMenu";
import { PopoverDemo } from "./demo/Popover";

const App: Component = () => {
	document.documentElement.classList.add(theme);
	return (
		<div class={theme} style={{ color: "white" }}>
			<DemoSection>
				<ButtonDemo />
			</DemoSection>
			<DemoSection>
				<TextInputDemo />
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
