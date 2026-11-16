import { TextArea } from "../src/components/TextArea/TextArea";
import { NumberField } from "../src/components/NumberField/NumberField";
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

it.each([TextField, TextArea, NumberField])(
	"server-renders the field label pointing at its input",
	Field => {
		const html = renderToString(() => <Field label="Email address" />);
		const labelFor = html.match(/<label[^>]*\sfor="([^"]+)"/)?.[1];
		const inputId = html.match(/<(?:input|textarea)[^>]*\sid="([^"]+)"/)?.[1];
		expect(inputId).toBeTruthy();
		expect(labelFor).toBe(inputId);
	},
);
