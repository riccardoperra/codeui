import {
	HoverCard,
	HoverCardContent,
	HoverCardItem,
	HoverCardList,
	HoverCardTrigger,
	Link,
	Text,
} from "@codeui/kit";
import { For } from "solid-js";

// Each state changes shape as well as colour. A finished entry shows no icon.
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
	done: { label: "Done", icon: () => undefined },
};

const tasks = [
	{ id: "T-12", title: "Migrate the kit to Solid 2", state: "running", depth: 0 },
	{
		id: "T-13",
		title: "Port Popover and Tooltip to the new reactivity model",
		state: "done",
		depth: 1,
	},
	{
		id: "T-14",
		title: "Rebuild HoverCard on the Kobalte popover",
		state: "running",
		depth: 1,
	},
	{ id: "T-15", title: "Keep keyboard opens free of motion", state: "todo", depth: 2 },
	{
		id: "T-16",
		title: "Update the docs demos for every overlay",
		state: "todo",
		depth: 1,
	},
] as const;

export default function HoverCardListDemo() {
	return (
		<Text as="p">
			Codex is working on{" "}
			<HoverCard>
				<HoverCardTrigger as={Link} href="#tasks">
					5 tasks
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
			.
		</Text>
	);
}
