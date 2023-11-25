import type { Meta, StoryObj } from "storybook-solidjs";

import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownSubMenu,
	DropdownSubMenuContent,
	DropdownSubMenuTrigger,
} from "@codeui/kit";
import { As } from "@kobalte/core";
import { JSX } from "solid-js";

const meta = {
	title: "DesignSystem/DropdownMenu",
	component: DropdownMenu,
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DropdownMenuStory: Story = {
	name: "DropdownMenu",
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<As component={Button} theme={"primary"}>
					Menu
				</As>
			</DropdownMenuTrigger>
			<DropdownMenuPortal>
				<DropdownMenuContent>
					<DropdownMenuItem>Item 1</DropdownMenuItem>
					<DropdownMenuItem>Item 2</DropdownMenuItem>
					<DropdownMenuItem>Item 3</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	),
};

export const DropdownMenuNestedStory: Story = {
	name: "DropdownMenu Nested",
	render: () => (
		<DropdownMenu gutter={6}>
			<DropdownMenuTrigger asChild>
				<As component={Button} theme={"tertiary"}>
					Menu
				</As>
			</DropdownMenuTrigger>

			<DropdownMenuPortal>
				<DropdownMenuContent>
					<DropdownMenuItem rightSlot={"⌘+K"}>Commit</DropdownMenuItem>
					<DropdownMenuItem rightSlot={"⇧+⌘+K"}>Push</DropdownMenuItem>
					<DropdownMenuSeparator />

					<DropdownMenuItem disabled rightSlot={"⌘+T"}>
						Update Project
					</DropdownMenuItem>
					<DropdownSubMenu>
						<DropdownSubMenuTrigger rightSlot={<ArrowRightIcon />}>
							GitHub
						</DropdownSubMenuTrigger>
						<DropdownMenuPortal>
							<DropdownSubMenuContent>
								<DropdownMenuItem>Create Pull Request…</DropdownMenuItem>
								<DropdownMenuItem>View Pull Requests</DropdownMenuItem>
								<DropdownMenuItem>Sync Fork</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Open on GitHub</DropdownMenuItem>

								<DropdownSubMenu>
									<DropdownSubMenuTrigger rightSlot={<ArrowRightIcon />}>
										GitHub
									</DropdownSubMenuTrigger>
									<DropdownMenuPortal>
										<DropdownSubMenuContent>
											<DropdownMenuItem>Create Pull Request…</DropdownMenuItem>
											<DropdownMenuItem>View Pull Requests</DropdownMenuItem>
											<DropdownMenuItem>Sync Fork</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem>Open on GitHub</DropdownMenuItem>
										</DropdownSubMenuContent>
									</DropdownMenuPortal>
								</DropdownSubMenu>
							</DropdownSubMenuContent>
						</DropdownMenuPortal>
					</DropdownSubMenu>
				</DropdownMenuContent>
			</DropdownMenuPortal>
		</DropdownMenu>
	),
};

function ArrowRightIcon(props: JSX.IntrinsicElements["svg"]) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			{...props}
			width={"1.1em"}
			height={"1.1em"}
		>
			<path
				fill-rule="evenodd"
				d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
				clip-rule="evenodd"
			/>
		</svg>
	);
}
