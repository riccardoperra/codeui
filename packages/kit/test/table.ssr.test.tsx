import { renderToString } from "solid-js/web";
import { Table, TableScrollArea } from "../src/components/Table/Table";

it("server-renders a native table with its caption, headers and cells", () => {
	const html = renderToString(() => (
		<Table size="sm" striped>
			<caption>Releases</caption>
			<thead>
				<tr>
					<th scope="col">Version</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>0.1.0</td>
				</tr>
			</tbody>
		</Table>
	));
	expect(html).toMatch(/<table[^>]*data-cui="table-root"[^>]*>/);
	expect(html).toMatch(/<table[^>]*data-size="sm"/);
	expect(html).toMatch(/<table[^>]*data-striped/);
	expect(html).toMatch(/<caption[^>]*>Releases<\/caption>/);
	expect(html).toMatch(/<th scope="col">Version<\/th>/);
	expect(html).toMatch(/<td>0.1.0<\/td>/);
});

it("server-renders a labelled scroll area as a focusable region", () => {
	const html = renderToString(() => (
		<TableScrollArea aria-label="Releases">
			<Table />
		</TableScrollArea>
	));
	expect(html).toMatch(/<div[^>]*role="region"/);
	expect(html).toMatch(/<div[^>]*tabindex="0"/i);
	expect(html).toMatch(/<div[^>]*aria-label="Releases"/);
});
