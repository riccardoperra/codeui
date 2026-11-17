import { createSignal } from "solid-js";
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from "@codeui/kit";

export default function DropdownMenuBasic() {
	const [last, setLast] = createSignal("none");
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger as={Button} theme="secondary">
					Export
				</DropdownMenuTrigger>
				<DropdownMenuPortal>
					<DropdownMenuContent>
						<DropdownMenuItem rightSlot="⌘S" onSelect={() => setLast("PNG")}>
							Save as PNG
						</DropdownMenuItem>
						<DropdownMenuItem rightSlot="⇧⌘S" onSelect={() => setLast("SVG")}>
							Save as SVG
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => setLast("JPEG")}>Save as JPEG</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenuPortal>
			</DropdownMenu>
			<span>Last export: {last()}</span>
		</>
	);
}
