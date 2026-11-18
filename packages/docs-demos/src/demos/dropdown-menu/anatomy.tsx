import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@codeui/kit";

/** Open, with the menu rendered inline instead of in a portal. */
export default function DropdownMenuAnatomy() {
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-2)", "justify-items": "start" }}>
			<DropdownMenu open>
				<DropdownMenuTrigger as={Button} variant="secondary">
					Export
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem rightSlot="⌘S">Save as PNG</DropdownMenuItem>
					<DropdownMenuItem rightSlot="⇧⌘S">Save as SVG</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
