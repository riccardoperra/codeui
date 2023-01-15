import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownSubMenu,
	DropdownSubMenuContent,
	DropdownSubMenuTrigger,
} from "@codeui/kit";
import { DemoSectionRow } from "../ui/DemoSection";
import { createSignal, JSX } from "solid-js";

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

export function DropdownMenuDemo() {
	const [menuControlled, setMenuControlled] = createSignal(false);

	return (
		<div style={{ "min-height": "600px" }}>
			<h1 class={"title"}>Dropdown Menu</h1>

			<DemoSectionRow>
				<DropdownMenu>
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
							<DropdownMenuItem rightSlot={"⌘+K"}>Commit</DropdownMenuItem>
							<DropdownMenuItem rightSlot={"⇧+⌘+K"}>Push</DropdownMenuItem>
							<DropdownMenuSeparator />

							<DropdownMenuItem isDisabled rightSlot={"⌘+T"}>
								Update Project
							</DropdownMenuItem>
							<DropdownSubMenu>
								<DropdownSubMenuTrigger rightSlot={<ArrowRightIcon />}>
									GitHub
								</DropdownSubMenuTrigger>
								<DropdownMenuPortal>
									<DropdownSubMenuContent class="dropdown-menu__sub-content">
										<DropdownMenuItem>Create Pull Request…</DropdownMenuItem>
										<DropdownMenuItem>View Pull Requests</DropdownMenuItem>
										<DropdownMenuItem>Sync Fork</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem>Open on GitHub</DropdownMenuItem>

										<DropdownSubMenu>
											<DropdownSubMenuTrigger rightSlot={<ArrowRightIcon />}>
												GitHub
											</DropdownSubMenuTrigger>
											<DropdownMenuPortal>
												<DropdownSubMenuContent class="dropdown-menu__sub-content">
													<DropdownMenuItem>Create Pull Request…</DropdownMenuItem>
													<DropdownMenuItem>View Pull Requests</DropdownMenuItem>
													<DropdownMenuItem>Sync Fork</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem>Open on GitHub</DropdownMenuItem>
												</DropdownSubMenuContent>
											</DropdownMenuPortal>
										</DropdownSubMenu>
									</DropdownSubMenuContent>
								</DropdownMenuPortal>
							</DropdownSubMenu>
						</DropdownMenuContent>
					</DropdownMenuPortal>
				</DropdownMenu>
			</DemoSectionRow>
		</div>
	);
}
