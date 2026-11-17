import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
	DropdownSubMenu,
	DropdownSubMenuContent,
	DropdownSubMenuTrigger,
} from "@codeui/kit";

export default function DropdownMenuDisabled() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger as={Button} theme="secondary">
				Export
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent>
					<DropdownMenuItem>Save as PNG</DropdownMenuItem>
					<DropdownMenuItem disabled>Export as video</DropdownMenuItem>
					<DropdownSubMenu>
						<DropdownSubMenuTrigger disabled rightSlot="›">
							Export as GIF
						</DropdownSubMenuTrigger>
						<DropdownMenuPortal>
							<DropdownSubMenuContent>
								<DropdownMenuItem>15 fps</DropdownMenuItem>
							</DropdownSubMenuContent>
						</DropdownMenuPortal>
					</DropdownSubMenu>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
}
