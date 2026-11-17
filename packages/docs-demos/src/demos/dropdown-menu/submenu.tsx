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

export default function DropdownMenuSubmenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger as={Button} theme="secondary">
				Share
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent>
					<DropdownMenuItem>Open in new tab</DropdownMenuItem>
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
					<DropdownSubMenu gutter={4}>
						<DropdownSubMenuTrigger rightSlot="›">Post to</DropdownSubMenuTrigger>
						<DropdownMenuPortal>
							<DropdownSubMenuContent>
								<DropdownMenuItem>Mastodon</DropdownMenuItem>
								<DropdownMenuItem>Bluesky</DropdownMenuItem>
							</DropdownSubMenuContent>
						</DropdownMenuPortal>
					</DropdownSubMenu>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
}
