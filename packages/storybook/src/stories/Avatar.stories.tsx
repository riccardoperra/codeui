import type { Meta, StoryObj } from "storybook-solidjs-vite";
import { Avatar } from "@codeui/kit";
import { For } from "solid-js";
import { DocsContainerTitle, DocsItemsContainer } from "./components/Section.jsx";

// A local picture, so captures do not depend on the network.
const picture =
	"data:image/svg+xml;utf8," +
	encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6c28b"/><stop offset="1" stop-color="#c4795a"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="26" r="11" fill="#5b3a29"/><path d="M12 64c2-14 10-20 20-20s18 6 20 20z" fill="#2f4f6f"/></svg>`,
	);

const people = [
	{ name: "Ada Lovelace", identifier: "user_ada" },
	{ name: "Grace Hopper", identifier: "user_grace" },
	{ name: "Alan Turing", identifier: "user_alan" },
	{ name: "Katherine Johnson", identifier: "user_katherine" },
	{ name: "Linus", identifier: "user_linus" },
	{ name: "Edsger Dijkstra", identifier: "user_edsger" },
	{ name: "Barbara Liskov", identifier: "user_barbara" },
	{ name: "Margaret Hamilton", identifier: "user_margaret" },
];

const sizes = ["xs", "sm", "md", "lg"] as const;

const meta = {
	title: "DesignSystem/Avatar",
	component: Avatar,
	tags: ["autodocs"],
	argTypes: {
		size: { options: sizes, control: { type: "inline-radio" } },
		unassigned: { control: { type: "boolean" } },
		tooltip: { control: { type: "boolean" } },
	},
	args: { name: "Ada Lovelace", identifier: "user_ada", size: "sm" },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AvatarStory: Story = {
	name: "Avatar",
};

export const Initials: Story = {
	render: () => (
		<>
			<DocsContainerTitle>Hue from the id</DocsContainerTitle>
			<DocsItemsContainer>
				<For each={people}>{person => <Avatar size="sm" {...person} />}</For>
			</DocsItemsContainer>
			<DocsContainerTitle>Same name, different id</DocsContainerTitle>
			<DocsItemsContainer>
				<Avatar size="sm" name="Sam Lee" identifier="user_sam_1" />
				<Avatar size="sm" name="Sam Lee" identifier="user_sam_2" />
				<Avatar size="sm" name="Sam Lee" identifier="user_sam_3" />
			</DocsItemsContainer>
			<DocsContainerTitle>No id: neutral</DocsContainerTitle>
			<DocsItemsContainer>
				<Avatar size="sm" name="Guest" />
			</DocsItemsContainer>
		</>
	),
};

export const Sizes: Story = {
	render: () => (
		<For each={["compact", "comfortable", "touch"] as const}>
			{density => (
				<div data-cui-density={density}>
					<DocsContainerTitle>{density}</DocsContainerTitle>
					<DocsItemsContainer>
						<For each={sizes}>
							{size => (
								<span
									style={{ display: "inline-flex", gap: "8px", "align-items": "center" }}
								>
									<Avatar size={size} name="Ada Lovelace" identifier="user_ada" />
									<Avatar
										size={size}
										name="Ada Lovelace"
										identifier="user_ada"
										src={picture}
									/>
									<Avatar size={size} unassigned />
								</span>
							)}
						</For>
					</DocsItemsContainer>
				</div>
			)}
		</For>
	),
};

export const States: Story = {
	render: () => (
		<>
			<DocsContainerTitle>Picture</DocsContainerTitle>
			<DocsItemsContainer>
				<Avatar size="md" name="Ada Lovelace" identifier="user_ada" src={picture} />
			</DocsItemsContainer>
			<DocsContainerTitle>Picture failed to load</DocsContainerTitle>
			<DocsItemsContainer>
				<Avatar
					size="md"
					name="Ada Lovelace"
					identifier="user_ada"
					src="/missing-avatar.png"
				/>
			</DocsItemsContainer>
			<DocsContainerTitle>Unassigned</DocsContainerTitle>
			<DocsItemsContainer>
				<Avatar size="md" unassigned />
			</DocsItemsContainer>
		</>
	),
};
