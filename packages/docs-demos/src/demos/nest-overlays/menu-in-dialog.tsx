import { createSignal } from "solid-js";
import {
	Button,
	Dialog,
	DialogPanelContent,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
	Tooltip,
} from "@codeui/kit";

export default function MenuInDialog() {
	const [open, setOpen] = createSignal(false);
	const [scale, setScale] = createSignal("2x");
	return (
		<>
			<Button variant="secondary" onClick={() => setOpen(true)}>
				Export snippet
			</Button>
			<Dialog open={open()} onOpenChange={setOpen} size="sm" title="Export snippet">
				<DialogPanelContent>
					<div style={{ display: "flex", gap: "8px", "align-items": "center" }}>
						<DropdownMenu>
							<DropdownMenuTrigger as={Button} variant="secondary">
								Scale: {scale()}
							</DropdownMenuTrigger>
							<DropdownMenuPortal>
								<DropdownMenuContent>
									<DropdownMenuItem onSelect={() => setScale("1x")}>1x</DropdownMenuItem>
									<DropdownMenuItem onSelect={() => setScale("2x")}>2x</DropdownMenuItem>
									<DropdownMenuItem onSelect={() => setScale("3x")}>3x</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenuPortal>
						</DropdownMenu>
						<Tooltip content="Higher scales make sharper, larger files" variant="secondary">
							<Button variant="secondary">Why scale?</Button>
						</Tooltip>
					</div>
				</DialogPanelContent>
			</Dialog>
		</>
	);
}
