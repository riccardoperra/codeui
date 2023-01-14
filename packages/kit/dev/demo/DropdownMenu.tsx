import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from "@codeui/kit";
import { DemoSectionRow } from "../ui/DemoSection";
import { createEffect, createSignal } from "solid-js";

export function DropdownMenuDemo() {
	const [menuControlled, setMenuControlled] = createSignal(false);

	createEffect(() => console.log(menuControlled()));
	return (
		<>
			<h1 class={"title"}>Dropdown Menu</h1>

			<DemoSectionRow>
				<DropdownMenu gutter={6}>
					<DropdownMenuTrigger as={Button} theme={"primary"}>
						Menu
					</DropdownMenuTrigger>
					<DropdownMenuPortal>
						<DropdownMenuContent>
							<DropdownMenuItem>Item 1</DropdownMenuItem>
							<DropdownMenuItem>Item 2</DropdownMenuItem>
							<DropdownMenuItem>Item 3</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenuPortal>
				</DropdownMenu>

				<DropdownMenu
					gutter={6}
					isOpen={menuControlled()}
					onOpenChange={setMenuControlled}
				>
					<DropdownMenuTrigger as={Button} theme={"tertiary"}>
						Menu {menuControlled() ? "Close" : "Open"}
					</DropdownMenuTrigger>
					<DropdownMenuPortal>
						<DropdownMenuContent>
							<DropdownMenuItem>Item 1</DropdownMenuItem>
							<DropdownMenuItem>Item 2</DropdownMenuItem>
							<DropdownMenuItem>Item 3</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenuPortal>
				</DropdownMenu>
			</DemoSectionRow>
		</>
	);
}
