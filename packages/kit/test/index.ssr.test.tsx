import { renderToString } from "solid-js/web";
import { Button } from "../src/components/Button/Button";
import { TextField } from "../src/components/TextField/TextField";

it("server-renders the button text", () => {
	const html = renderToString(() => <Button>Save</Button>);
	expect(html).toContain("Save");
	expect(html).toContain("<button");
});

it("server-renders the text field label", () => {
	const html = renderToString(() => <TextField label="Email address" />);
	expect(html).toContain("Email address");
});

// Known gap: Kobalte 0.13.14 writes `for` during SSR only when the input renders before the label. The kit renders the label first.
it.failing("server-renders the text field label pointing at its input", () => {
	const html = renderToString(() => <TextField label="Email address" />);
	const labelFor = html.match(/<label[^>]*\sfor="([^"]+)"/)?.[1];
	const inputId = html.match(/<input[^>]*\sid="([^"]+)"/)?.[1];
	expect(inputId).toBeTruthy();
	expect(labelFor).toBe(inputId);
});
