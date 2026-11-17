import { RadioList, RadioListItem } from "@codeui/kit";
export default function Demo() {
	return (
		<div style={{ display: "grid", gap: "var(--cui-space-4)" }}>
			<RadioList label="Export format (xs)" size="xs" defaultValue="png">
				<RadioListItem value="png" label="PNG" />
				<RadioListItem value="svg" label="SVG" />
				<RadioListItem value="jpeg" label="JPEG" disabled />
			</RadioList>
			<RadioList label="Export format (sm)" size="sm" defaultValue="png">
				<RadioListItem value="png" label="PNG" />
				<RadioListItem value="svg" label="SVG" />
				<RadioListItem value="jpeg" label="JPEG" disabled />
			</RadioList>
			<RadioList label="Export format (md)" size="md" defaultValue="png">
				<RadioListItem value="png" label="PNG" />
				<RadioListItem value="svg" label="SVG" />
				<RadioListItem value="jpeg" label="JPEG" disabled />
			</RadioList>
			<RadioList label="Export format (lg)" size="lg" defaultValue="png">
				<RadioListItem value="png" label="PNG" />
				<RadioListItem value="svg" label="SVG" />
				<RadioListItem value="jpeg" label="JPEG" disabled />
			</RadioList>
			<RadioList label="Export format (xl)" size="xl" defaultValue="png">
				<RadioListItem value="png" label="PNG" />
				<RadioListItem value="svg" label="SVG" />
				<RadioListItem value="jpeg" label="JPEG" disabled />
			</RadioList>
		</div>
	);
}
