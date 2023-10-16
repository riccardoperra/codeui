import { createSignal, For } from "solid-js";
import { Button, Tabs, TabsContent, TabsHeader, TabsList } from "@codeui/kit";
import { DemoSectionRow } from "~/components/ui/DemoSection";

export default function TabsDemo() {
	const [tabs, setTabs] = createSignal([
		{ id: "1", title: "Tab 1", content: "Tab body 1" },
		{ id: "2", title: "Tab 2", content: "Tab body 2" },
		{ id: "3", title: "Tab 3", content: "Tab body 3" },
	]);
	const addTab = () => {
		setTabs(prev => [
			...prev,
			{
				id: String(prev.length + 1),
				title: `Tab ${prev.length + 1}`,
				content: `Tab Body ${prev.length + 1}`,
			},
		]);
	};
	const removeTab = () => {
		if (tabs().length > 1) {
			setTabs(prev => prev.slice(0, -1));
		}
	};
	return (
		<>
			<h1 class={"title"}>Tabs</h1>

			<div style={{ display: "flex", gap: "2rem" }}>
				<Button theme={"primary"} onClick={addTab}>
					Add tab
				</Button>
				<Button theme={"primary"} onClick={removeTab}>
					Remove tab
				</Button>
			</div>

			<h2>Dynamic default style</h2>

			<DemoSectionRow>
				<Tabs theme={"default"}>
					<TabsList>
						<For each={tabs()}>
							{tab => <TabsHeader value={tab.id}>{tab.title}</TabsHeader>}
						</For>
					</TabsList>
					<For each={tabs()}>
						{tab => <TabsContent value={tab.id}>{tab.content}</TabsContent>}
					</For>
				</Tabs>
			</DemoSectionRow>

			<h2>Dynamic default style - Vertical</h2>

			<DemoSectionRow>
				<Tabs theme={"default"} orientation={"vertical"}>
					<TabsList>
						<For each={tabs()}>
							{tab => <TabsHeader value={tab.id}>{tab.title}</TabsHeader>}
						</For>
					</TabsList>
					<For each={tabs()}>
						{tab => <TabsContent value={tab.id}>{tab.content}</TabsContent>}
					</For>
				</Tabs>
			</DemoSectionRow>

			<h2>Inline style</h2>

			<DemoSectionRow>
				<Tabs theme={"inline"}>
					<TabsList>
						<For each={tabs()}>
							{tab => <TabsHeader value={tab.id}>{tab.title}</TabsHeader>}
						</For>
					</TabsList>
					<For each={tabs()}>
						{tab => <TabsContent value={tab.id}>{tab.content}</TabsContent>}
					</For>
				</Tabs>
			</DemoSectionRow>

			<h2>Dynamic inline style - Vertical</h2>

			<DemoSectionRow>
				<Tabs theme={"inline"} orientation={"vertical"}>
					<TabsList>
						<For each={tabs()}>
							{tab => <TabsHeader value={tab.id}>{tab.title}</TabsHeader>}
						</For>
					</TabsList>
					<For each={tabs()}>
						{tab => <TabsContent value={tab.id}>{tab.content}</TabsContent>}
					</For>
				</Tabs>
			</DemoSectionRow>
		</>
	);
}
