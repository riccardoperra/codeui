import { Tabs, TabsContent, TabsHeader, TabsList } from "@codeui/kit";
import "./showcase.css";

export default function ProjectTabs() {
	return (
		<Tabs defaultValue="overview">
			<TabsList aria-label="Project">
				<TabsHeader value="overview">Overview</TabsHeader>
				<TabsHeader value="activity">Activity</TabsHeader>
				<TabsHeader value="settings">Settings</TabsHeader>
			</TabsList>
			<TabsContent value="overview">
				<p class="showcase-meta">12 open tasks, 3 due this week.</p>
			</TabsContent>
			<TabsContent value="activity">
				<p class="showcase-meta">Grace closed 4 tasks today.</p>
			</TabsContent>
			<TabsContent value="settings">
				<p class="showcase-meta">Name, visibility and members.</p>
			</TabsContent>
		</Tabs>
	);
}
