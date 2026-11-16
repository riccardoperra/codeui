import { createSignal, For } from "solid-js";
import { Button, Dialog, DialogPanelContent } from "@codeui/kit";

const sizes = ["xs", "sm", "md", "lg", "xl", "full"] as const;
type Size = (typeof sizes)[number];

export default function DialogSizes() {
	const [size, setSize] = createSignal<Size | null>(null);
	return (
		<>
			<For each={sizes}>
				{value => (
					<Button theme="secondary" onClick={() => setSize(value)}>
						{value}
					</Button>
				)}
			</For>
			<Dialog
				open={size() !== null}
				onOpenChange={open => !open && setSize(null)}
				size={size() ?? undefined}
				title={`Dialog size ${size()}`}
			>
				<DialogPanelContent>
					The panel is as wide as the size allows. Press Escape or the close button to close it.
				</DialogPanelContent>
			</Dialog>
		</>
	);
}
