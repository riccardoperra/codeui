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

export default function DropdownMenuDemo() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger as={Button} theme="secondary">
				Export
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent>
					<DropdownMenuItem rightSlot="⌘S">Save as PNG</DropdownMenuItem>
					<DropdownMenuItem rightSlot="⇧⌘S">Save as SVG</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownSubMenu>
						<DropdownSubMenuTrigger rightSlot="›">Copy</DropdownSubMenuTrigger>
						<DropdownMenuPortal>
							<DropdownSubMenuContent>
								<DropdownMenuItem>Copy image</DropdownMenuItem>
								<DropdownMenuItem>Copy link</DropdownMenuItem>
								<DropdownMenuItem>Copy embed code</DropdownMenuItem>
							</DropdownSubMenuContent>
						</DropdownMenuPortal>
					</DropdownSubMenu>
					<DropdownMenuSeparator />
					<DropdownMenuItem disabled>Export as video</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
}
