import type { Meta, StoryObj } from "storybook-solidjs";

import { Button, Tabs, TabsContent, TabsHeader, TabsList } from "@codeui/kit";
import { createSignal, For } from "solid-js";
import { DocsContainerFlex, DocsItemsContainer } from "./components/Section.jsx";

const meta = {
	title: "DesignSystem/Tabs",
	component: Tabs,
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

const tabs = [
	{ id: "1", title: "Tab 1", content: "Tab body 1" },
	{ id: "2", title: "Tab 2", content: "Tab body 2" },
	{ id: "3", title: "Tab 3", content: "Tab body 3" },
];

export const TabsStory: Story = {
	name: "Tabs",
	render: () => (
		<Tabs theme={"default"}>
			<TabsList>
				<For each={tabs}>
					{tab => <TabsHeader value={tab.id}>{tab.title}</TabsHeader>}
				</For>
			</TabsList>
			<For each={tabs}>
				{tab => <TabsContent value={tab.id}>{tab.content}</TabsContent>}
			</For>
		</Tabs>
	),
};

export const TabsInlineHorizontalThemeStory: Story = {
	name: "Tabs Inline (horizontal)",
	render: () => (
		<Tabs theme={"inline"} orientation={"horizontal"}>
			<TabsList>
				<For each={tabs}>
					{tab => <TabsHeader value={tab.id}>{tab.title}</TabsHeader>}
				</For>
			</TabsList>
			<For each={tabs}>
				{tab => <TabsContent value={tab.id}>{tab.content}</TabsContent>}
			</For>
		</Tabs>
	),
};

export const TabsInlineThemeStory: Story = {
	name: "Tabs Inline (vertical)",
	render: () => (
		<DocsItemsContainer>
			<Tabs theme={"inline"} orientation={"vertical"}>
				<TabsList>
					<For each={tabs}>
						{tab => <TabsHeader value={tab.id}>{tab.title}</TabsHeader>}
					</For>
				</TabsList>
				<For each={tabs}>
					{tab => <TabsContent value={tab.id}>{tab.content}</TabsContent>}
				</For>
			</Tabs>
		</DocsItemsContainer>
	),
};

export const DynamicTabsStory: Story = {
	name: "Tabs Dynamic",
	render: () => {
		const [value, setValue] = createSignal(tabs);
		const addTab = () => {
			setValue(prev => [
				...prev,
				{
					id: String(prev.length + 1),
					title: `Tab ${prev.length + 1}`,
					content: `Tab Body ${prev.length + 1}`,
				},
			]);
		};
		const removeTab = () => {
			if (value().length > 1) {
				setValue(prev => prev.slice(0, -1));
			}
		};
		return (
			<DocsItemsContainer>
				<DocsContainerFlex gap={"2rem"}>
					<DocsContainerFlex direction={"row"} gap={"1rem"}>
						<Button size={"sm"} theme={"secondary"} onClick={addTab}>
							Add tab
						</Button>
						<Button size={"sm"} theme={"secondary"} onClick={removeTab}>
							Remove tab
						</Button>
					</DocsContainerFlex>

					<Tabs theme={"inline"} orientation={"horizontal"}>
						<TabsList>
							<For each={value()}>
								{tab => <TabsHeader value={tab.id}>{tab.title}</TabsHeader>}
							</For>
						</TabsList>
						<For each={value()}>
							{tab => <TabsContent value={tab.id}>{tab.content}</TabsContent>}
						</For>
					</Tabs>
				</DocsContainerFlex>
			</DocsItemsContainer>
		);
	},
};
