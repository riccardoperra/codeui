import { Button, Popover, PopoverContent, PopoverTrigger } from "@codeui/kit";
import { createSignal } from "solid-js";
import { As } from "@kobalte/core";
import { DemoSectionRow } from "~/components/ui/DemoSection";

export default function PopoverDemo() {
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

				<Popover open={open()} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<As component={Button} theme={"secondary"}>
							Open (controlled)
						</As>
					</PopoverTrigger>
					<PopoverContent title={"Title"}>About Kobalte A UI toolkit</PopoverContent>
				</Popover>

				<Popover placement={"bottom-start"}>
					<PopoverTrigger asChild>
						<As component={Button} theme={"secondary"}>
							Custom position
						</As>
					</PopoverTrigger>
					<PopoverContent title={"Title"}>
						About Kobalte A UI toolkit for building accessible web apps and design systems
						with SolidJS.
					</PopoverContent>
				</Popover>

				<Popover placement={"bottom-start"}>
					<PopoverTrigger asChild>
						<As component={Button} theme={"secondary"}>
							Bordered
						</As>
					</PopoverTrigger>
					<PopoverContent variant={"bordered"}>
						About Kobalte A UI toolkit for building accessible web apps and design systems
						with SolidJS.
					</PopoverContent>
				</Popover>
			</DemoSectionRow>
		</div>
	);
}
