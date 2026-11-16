import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Kbd,
	Stack,
} from "@codeui/kit";

export default function KbdInMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger as={Button} theme="secondary">
				Export
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent>
					<DropdownMenuItem
						aria-keyshortcuts="Meta+S"
						rightSlot={
							<Stack as="kbd" direction="row" gap="0.5" aria-hidden="true">
								<Kbd variant="hint">⌘</Kbd>
								<Kbd variant="hint">S</Kbd>
							</Stack>
						}
					>
						Save as PNG
					</DropdownMenuItem>
					<DropdownMenuItem
						aria-keyshortcuts="Shift+Meta+S"
						rightSlot={
							<Stack as="kbd" direction="row" gap="0.5" aria-hidden="true">
								<Kbd variant="hint">⇧</Kbd>
								<Kbd variant="hint">⌘</Kbd>
								<Kbd variant="hint">S</Kbd>
							</Stack>
						}
					>
						Save as SVG
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Copy link</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	);
}
