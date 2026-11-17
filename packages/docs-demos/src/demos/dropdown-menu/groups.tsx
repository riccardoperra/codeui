import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@codeui/kit";

export default function DropdownMenuGroups() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger as={Button} theme="secondary">
				Snippet
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent>
					<DropdownMenuItem rightSlot="F2">Rename</DropdownMenuItem>
					<DropdownMenuItem rightSlot="⌘D">Duplicate</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Move to folder</DropdownMenuItem>
					<DropdownMenuItem>Copy link</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem rightSlot="⌫">Delete</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
}
