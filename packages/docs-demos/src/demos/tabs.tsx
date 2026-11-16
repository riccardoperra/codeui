import { createSignal } from "solid-js";
import { Tabs, TabsContent, TabsHeader, TabsList } from "@codeui/kit";

export default function TabsDemo() {
	const [tab, setTab] = createSignal("editor");
	return (
		<Tabs value={tab()} onChange={setTab}>
			<TabsList>
				<TabsHeader value="editor">Editor</TabsHeader>
				<TabsHeader value="theme">Theme</TabsHeader>
				<TabsHeader value="font">Font</TabsHeader>
			</TabsList>
			<TabsContent value="editor">Language, tab size and line numbers.</TabsContent>
			<TabsContent value="theme">Background, padding and window style.</TabsContent>
			<TabsContent value="font">Family, weight and ligatures.</TabsContent>
		</Tabs>
	);
}
