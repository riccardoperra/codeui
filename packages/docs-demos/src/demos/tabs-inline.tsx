import { Tabs, TabsContent, TabsHeader, TabsList } from "@codeui/kit";

export default function TabsInlineDemo() {
	return (
		<Tabs theme="inline" defaultValue="snippets">
			<TabsList>
				<TabsHeader value="snippets">Snippets</TabsHeader>
				<TabsHeader value="presets">Presets</TabsHeader>
				<TabsHeader value="shared">Shared</TabsHeader>
			</TabsList>
			<TabsContent value="snippets">Your saved snippets.</TabsContent>
			<TabsContent value="presets">Saved theme and font combinations.</TabsContent>
			<TabsContent value="shared">Snippets shared with a public link.</TabsContent>
		</Tabs>
	);
}
