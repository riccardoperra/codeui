import { createSignal } from "solid-js";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from "@codeui/kit";

export default function DropdownMenuControlled() {
	const [open, setOpen] = createSignal(false);
	const [format, setFormat] = createSignal("PNG");
	return (
		<>
			<DropdownMenu open={open()} onOpenChange={setOpen}>
				<DropdownMenuTrigger as={Button} variant="secondary">
					Format: {format()}
				</DropdownMenuTrigger>
				<DropdownMenuPortal>
					<DropdownMenuContent>
						<DropdownMenuItem onSelect={() => setFormat("PNG")}>PNG</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => setFormat("SVG")}>SVG</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => setFormat("JPEG")}>JPEG</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenuPortal>
			</DropdownMenu>
			<span>The menu is {open() ? "open" : "closed"}.</span>
		</>
	);
}
