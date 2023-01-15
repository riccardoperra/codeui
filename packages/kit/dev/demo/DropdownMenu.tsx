import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from "@codeui/kit";
import { DemoSectionRow } from "../ui/DemoSection";
import { createSignal } from "solid-js";

export function DropdownMenuDemo() {
	const [menuControlled, setMenuControlled] = createSignal(false);

	return (
		<>
			<h1 class={"title"}>Dropdown Menu</h1>

			<DemoSectionRow>
				<DropdownMenu gutter={6}>
					<Button as={DropdownMenuTrigger} theme={"primary"}>
						Menu
					</Button>
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
					<Button as={DropdownMenuTrigger} theme={"tertiary"}>
						Menu {menuControlled() ? "Close" : "Open"}
					</Button>
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
