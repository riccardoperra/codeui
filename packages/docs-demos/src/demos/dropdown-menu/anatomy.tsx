import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@codeui/kit";

/** An open, non-modal menu drawn inline so the figure leaves the page interactive. */
export default function DropdownMenuAnatomy() {
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-2)", "justify-items": "start" }}>
			<DropdownMenu open modal={false}>
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
