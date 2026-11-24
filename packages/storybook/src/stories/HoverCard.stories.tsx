import type { Meta, StoryObj } from "storybook-solidjs-vite";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@codeui/kit";

const meta = {
	title: "DesignSystem/HoverCard",
	component: HoverCard,
	tags: ["autodocs"],
	argTypes: {
		placement: {
			options: ["right-start", "bottom-start", "top-start", "left-start"],
			control: { type: "select" },
		},
		openDelay: { control: { type: "number" } },
		closeDelay: { control: { type: "number" } },
	},
} satisfies Meta<typeof HoverCard>;

export default meta;

type Story = StoryObj<typeof meta>;

const ThreadCard = () => (
	<div style={{ display: "flex", "flex-direction": "column", gap: "4px" }}>
		<strong style={{ color: "var(--cui-text-default)", "font-weight": 600 }}>
			Fix flaky hydration test
		</strong>
		<span style={{ color: "var(--cui-text-muted)", "font-size": "12px" }}>
			Codex · opened 2 hours ago · 3 subagents
		</span>
		<span>Retries the portal check until the server snapshot is released.</span>
	</div>
);

export const HoverCardStory: Story = {
	name: "Thread details",
	args: { placement: "right-start" },
	render: props => (
		<div style={{ padding: "48px" }}>
			<HoverCard {...props}>
				<HoverCardTrigger href="#thread" style={{ color: "var(--cui-text-default)" }}>
					Fix flaky hydration test
				</HoverCardTrigger>
				<HoverCardContent>
					<ThreadCard />
				</HoverCardContent>
			</HoverCard>
		</div>
	),
};
