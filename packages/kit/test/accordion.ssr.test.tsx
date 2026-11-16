import { renderToString } from "solid-js/web";
import { Accordion } from "../src/components/Accordion/Accordion";
it("server renders labelled headers and expanded content without DOM measurement", () => {
	const html = renderToString(() => (
		<Accordion
			defaultValue="size"
			items={[{ value: "size", title: "Size", summary: "64", content: <p>Pixels</p> }]}
		/>
	));
	expect(html).toContain('aria-expanded="true"');
	expect(html).toContain("aria-labelledby=");
	expect(html).toContain("Pixels");
});
