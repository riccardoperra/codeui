import type { Meta, StoryObj } from "storybook-solidjs";

import { Button, Dialog, DialogPanelContent, DialogPanelFooter } from "@codeui/kit";
import { createSignal, For } from "solid-js";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
	title: "DesignSystem/Dialog",
	component: Dialog,
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
	render: () => (
		<div class={"itemsContainer"}>
			<For each={["xs", "sm", "md", "lg", "xl", "full"] as const}>
				{size => {
					const [open, setOpen] = createSignal(false);
					return (
						<>
							<Button theme={"primary"} onClick={() => setOpen(true)}>
								Open ({size})
							</Button>
							<Dialog
								open={open()}
								title={`Dialog title ${size}`}
								size={size}
								onOpenChange={value => setOpen(value)}
							>
								<DialogPanelContent>
									Kobalte is a UI toolkit for building accessible web apps and design
									systems with SolidJS. It provides a set of low-level UI components and
									primitives which can be the foundation for your design system
									implementation.
								</DialogPanelContent>
							</Dialog>
						</>
					);
				}}
			</For>
		</div>
	),
};

export const OverflowContent: Story = {
	render: () => {
		const [open, setOpen] = createSignal(false);
		return (
			<div class={"itemsContainer"}>
				<Button theme={"secondary"} onClick={() => setOpen(true)}>
					Open Dialog
				</Button>
				<Dialog open={open()} title={`Dialog title`} size={"md"} onOpenChange={setOpen}>
					<DialogPanelContent>
						{new Array(20).fill("").map(() => {
							return (
								<p>
									Kobalte is a UI toolkit for building accessible web apps and design
									systems with SolidJS. It provides a set of low-level UI components and
									primitives which can be the foundation for your design system
									implementation.
								</p>
							);
						})}
					</DialogPanelContent>
					<DialogPanelFooter>
						<Button theme={"secondary"}>Close</Button>
						<Button theme={"primary"}>Confirm</Button>
					</DialogPanelFooter>
				</Dialog>

				<Button theme={"secondary"} onClick={() => setOpen(true)}>
					Open Dialog (full)
				</Button>
				<Dialog open={open()} title={`Dialog title`} size={"full"} onOpenChange={setOpen}>
					<DialogPanelContent>
						{new Array(400).fill("").map(() => {
							return (
								<p>
									Kobalte is a UI toolkit for building accessible web apps and design
									systems with SolidJS. It provides a set of low-level UI components and
									primitives which can be the foundation for your design system
									implementation.
								</p>
							);
						})}
					</DialogPanelContent>
					<DialogPanelFooter>
						<Button theme={"secondary"}>Close</Button>
						<Button theme={"primary"}>Confirm</Button>
					</DialogPanelFooter>
				</Dialog>
			</div>
		);
	},
};
