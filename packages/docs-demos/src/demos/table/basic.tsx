import { Table, TableScrollArea, type TableProps } from "@codeui/kit";

export default function ExportFormats(props: Pick<TableProps, "size" | "striped">) {
	return (
		<TableScrollArea aria-label="Export formats">
			<Table size={props.size} striped={props.striped}>
				<caption>Export formats</caption>
				<thead>
					<tr>
						<th scope="col">Format</th>
						<th scope="col">Use</th>
						<th scope="col" style={{ "text-align": "end" }}>
							Scale
						</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th scope="row">PNG</th>
						<td>High-resolution screenshots</td>
						<td style={{ "text-align": "end" }}>2×</td>
					</tr>
					<tr>
						<th scope="row">JPEG</th>
						<td>Smaller files for sharing</td>
						<td style={{ "text-align": "end" }}>1×</td>
					</tr>
					<tr>
						<th scope="row">SVG</th>
						<td>Scalable artwork</td>
						<td style={{ "text-align": "end" }}>Any</td>
					</tr>
				</tbody>
			</Table>
		</TableScrollArea>
	);
}
