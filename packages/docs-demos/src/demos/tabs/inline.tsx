import { Tabs, TabsList, TabsHeader, TabsContent } from "@codeui/kit";
export default function Example() {
	return <Tabs defaultValue="code" variant="inline">
		<TabsList aria-label="Snippet details"><TabsHeader value="code">Code</TabsHeader><TabsHeader value="settings">Settings</TabsHeader><TabsHeader value="history" disabled>History</TabsHeader></TabsList>
		<TabsContent value="code">Your TypeScript snippet.</TabsContent><TabsContent value="settings">Font, theme, and export settings.</TabsContent><TabsContent value="history">Revision history.</TabsContent>
	</Tabs>;
}
