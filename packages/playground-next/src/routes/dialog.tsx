import { For } from "solid-js";
import { Button, Dialog, DialogPanelContent } from "@codeui/kit";
import { createStore } from "solid-js/store";
import { DemoSectionRow } from "~/components/ui/DemoSection";

export default function DialogDemo() {
	const [dialogState, setDialogState] = createStore({
		xs: false,
		sm: false,
		md: false,
		lg: false,
		xl: false,
		full: false,
	});
	return (
		<>
			{/*	Text Input */}
			<h1 class={"title"}>Dialog</h1>

			<DemoSectionRow>
				<For
					each={
						["xs", "sm", "md", "lg", "xl", "full"] as Parameters<
							typeof Dialog
						>[0]["size"][]
					}
				>
					{size => (
						<>
							<Button theme={"secondary"} onClick={() => setDialogState(size!, true)}>
								Open Dialog ({size})
							</Button>
							<Dialog
								open={dialogState[size!]}
								title={`Dialog title ${size}`}
								size={size}
								onOpenChange={value => setDialogState(size!, value)}
							>
								<DialogPanelContent>
									Kobalte is a UI toolkit for building accessible web apps and design
									systems with SolidJS. It provides a set of low-level UI components and
									primitives which can be the foundation for your design system
									implementation.
								</DialogPanelContent>
							</Dialog>
						</>
					)}
				</For>
			</DemoSectionRow>
		</>
	);
}
