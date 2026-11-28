import type { Meta, StoryObj } from "storybook-solidjs-vite";

import {
	HoverCard,
	HoverCardContent,
	HoverCardGroup,
	HoverCardItem,
	HoverCardList,
	HoverCardTrigger,
	Text,
} from "@codeui/kit";
import { For } from "solid-js";

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

// Each state changes shape as well as colour. Write each icon as one <svg> so its
// children are created in the SVG namespace.
const svg = {
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.5",
};
const states = {
	todo: {
		label: "To do",
		icon: () => (
			<svg {...svg}>
				<circle cx="8" cy="8" r="5.5" />
			</svg>
		),
	},
	running: {
		label: "Running",
		icon: () => (
			<svg {...svg}>
				<circle cx="8" cy="8" r="5.5" />
				<path d="M8 2.5a5.5 5.5 0 0 1 0 11z" fill="currentColor" />
			</svg>
		),
	},
	review: {
		label: "In review",
		icon: () => (
			<svg {...svg}>
				<circle cx="8" cy="8" r="5.5" stroke-dasharray="2 2" />
				<circle cx="8" cy="8" r="2" fill="currentColor" />
			</svg>
		),
	},
	// A finished entry shows no icon; its name stays in the accessible label.
	done: { label: "Done", icon: () => undefined },
} as const;

type Task = { id: string; title: string; state: keyof typeof states; depth: number };

const tasks: Task[] = [
	{ id: "T-12", title: "Migrate the kit to Solid 2", state: "running", depth: 0 },
	{
		id: "T-13",
		title: "Port Popover and Tooltip to the new reactivity model",
		state: "done",
		depth: 1,
	},
	{
		id: "T-14",
		title:
			"Rebuild HoverCard on Kobalte popover until upstream registers listeners in cleanup",
		state: "running",
		depth: 1,
	},
	{ id: "T-15", title: "Keep keyboard opens free of motion", state: "review", depth: 2 },
	{
		id: "T-16",
		title: "Hold portalled content through its exit animation",
		state: "todo",
		depth: 2,
	},
	{ id: "T-17", title: "Update the docs demos", state: "todo", depth: 1 },
	...Array.from(
		{ length: 22 },
		(_, index): Task => ({
			id: `T-${20 + index}`,
			title: `Check story ${index + 1} in dark and light themes at three viewport sizes`,
			state: index % 4 === 0 ? "running" : index % 3 === 0 ? "review" : "todo",
			depth: 1 + (index % 2),
		}),
	),
];

export const TaskList: Story = {
	name: "Task list",
	args: {},
	render: props => (
		<div style={{ padding: "48px" }}>
			<HoverCard {...props}>
				<HoverCardTrigger href="#tasks" style={{ color: "var(--cui-text-default)" }}>
					{tasks.length} tasks · {tasks.filter(task => task.state === "running").length}{" "}
					running
				</HoverCardTrigger>
				<HoverCardContent>
					<Text weight="semibold">Migrate the kit to Solid 2</Text>
					<HoverCardList aria-label="Tasks">
						<For each={tasks}>
							{task => (
								<HoverCardItem
									icon={states[task.state].icon()}
									iconLabel={states[task.state].label}
									identifier={task.id}
									depth={task.depth}
								>
									{task.title}
								</HoverCardItem>
							)}
						</For>
					</HoverCardList>
				</HoverCardContent>
			</HoverCard>
		</div>
	),
};

export const EdgePlacement: Story = {
	name: "No room on the right",
	args: {},
	render: props => (
		<div style={{ display: "flex", "justify-content": "flex-end", padding: "48px 16px" }}>
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

const threads = [
	{ id: "flaky", title: "Fix flaky hydration test", meta: "Codex · 2 hours ago · 3 subagents" },
	{ id: "popover", title: "Port Popover to Solid 2", meta: "Claude · yesterday" },
	{
		id: "docs",
		title: "Update the docs demos",
		meta: "Codex · 3 days ago",
		body: "Checks every story in dark and light themes at three viewport sizes, then opens a pull request for review.",
	},
	{ id: "tokens", title: "Rename motion tokens", meta: "Claude · last week" },
];

const ThreadRows = () => (
	<div style={{ display: "flex", "flex-direction": "column", gap: "4px", width: "240px" }}>
		<For each={threads}>
			{thread => (
				<HoverCard>
					<HoverCardTrigger
						href={`#${thread.id}`}
						style={{ color: "var(--cui-text-default)", padding: "6px 8px" }}
					>
						{thread.title}
					</HoverCardTrigger>
					<HoverCardContent>
						<strong style={{ color: "var(--cui-text-default)", "font-weight": 600 }}>
							{thread.title}
						</strong>
						<span style={{ color: "var(--cui-text-muted)", "font-size": "12px" }}>
							{thread.meta}
						</span>
						{thread.body && <span>{thread.body}</span>}
					</HoverCardContent>
				</HoverCard>
			)}
		</For>
	</div>
);

export const SharedCard: Story = {
	name: "Moving between rows",
	args: {},
	render: () => (
		<div style={{ padding: "48px" }}>
			<ThreadRows />
		</div>
	),
};

export const Groups: Story = {
	name: "Two groups",
	args: {},
	render: () => (
		<div style={{ display: "flex", gap: "320px", padding: "48px" }}>
			<HoverCardGroup>
				<ThreadRows />
			</HoverCardGroup>
			<HoverCardGroup>
				<ThreadRows />
			</HoverCardGroup>
		</div>
	),
};
