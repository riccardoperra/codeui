import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
	IconButton,
	icons,
} from "@codeui/kit";

export default function DropdownMenuIconTrigger() {
	return (
		<DropdownMenu placement="bottom-end">
			<DropdownMenuTrigger as={IconButton} variant="secondary" aria-label="More export options">
				<icons.ChevronDownIcon />
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent>
					<DropdownMenuItem>Copy to clipboard</DropdownMenuItem>
					<DropdownMenuItem>Export at 2x</DropdownMenuItem>
					<DropdownMenuItem>Export at 3x</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
}
