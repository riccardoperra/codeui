import { Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";
import { DemoSectionRow } from "../ui/DemoSection";
import { createSignal, JSX } from "solid-js";
import { As } from "@kobalte/core";

function ArrowRightIcon(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			{...props}
			width={"1.1em"}
			height={"1.1em"}
		>
			<path
				fill-rule="evenodd"
				d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
				clip-rule="evenodd"
			/>
		</svg>
	);
}

export function PopoverDemo() {
	const [open, setOpen] = createSignal(false);

	return (
		<div style={{ "min-height": "300px" }}>
			<h1 class={"title"}>Popover</h1>

			<DemoSectionRow>
				<Popover>
					<PopoverTrigger asChild>
						<As component={Button} theme={"secondary"}>
							Open
						</As>
					</PopoverTrigger>
					<PopoverContent title={"Title"}>
						About Kobalte A UI toolkit for building accessible web apps and design systems
						with SolidJS.
					</PopoverContent>
				</Popover>

				<Popover isOpen={open()} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<As component={Button} theme={"secondary"}>
							Open (controlled)
						</As>
					</PopoverTrigger>
					<PopoverContent title={"Title"}>About Kobalte A UI toolkit</PopoverContent>
				</Popover>
			</DemoSectionRow>
		</div>
	);
}
