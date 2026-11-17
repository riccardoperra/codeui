import { Tabs, TabsContent, TabsHeader, TabsList } from "@codeui/kit";

export default function TabsAnatomy() {
	return (
		<Tabs defaultValue="code">
			<TabsList aria-label="Snippet details">
				<TabsHeader value="code">Code</TabsHeader>
				<TabsHeader value="settings">Settings</TabsHeader>
			</TabsList>
			<TabsContent value="code">Your TypeScript snippet.</TabsContent>
			<TabsContent value="settings">Font, theme, and export settings.</TabsContent>
		</Tabs>
	);
}
