import { Badge } from "../src/components/Badge/Badge";
import { Kbd } from "../src/components/Kbd/Kbd";
import { Skeleton } from "../src/components/Skeleton/Skeleton";
import { Spinner } from "../src/components/Spinner/Spinner";
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

it("server-renders a labelled spinner as a named status", () => {
	const html = renderToString(() => <Spinner label="Loading" />);
	expect(html).toMatch(/<svg[^>]*role="status"/);
	expect(html).toMatch(/<svg[^>]*aria-label="Loading"/);
});

it("server-renders a skeleton hidden from assistive technology", () => {
	const html = renderToString(() => <Skeleton width="8rem" height="1rem" />);
	expect(html).toMatch(/aria-hidden="true"/);
	expect(html).toContain("width:8rem");
});

it("server-renders the badge and key labels", () => {
	const html = renderToString(() => (
		<>
			<Badge>Default</Badge>
			<Kbd>⌘K</Kbd>
		</>
	));
	expect(html).toContain("Default");
	expect(html).toMatch(/<kbd[^>]*>⌘K<\/kbd>/);
});

import { OptionCardGroup } from "../src/components/OptionCard/OptionCard";
it("server-renders named option cards and the selected form value", () => {
	const html = renderToString(() => (
		<OptionCardGroup
			label="Mode"
			name="mode"
			defaultValue="dark"
			items={[{ value: "dark", label: "Dark", description: "Dim workspace" }]}
		/>
	));
	expect(html).toContain('role="radiogroup"');
	expect(html).toContain('type="radio"');
	expect(html).toContain('value="dark"');
	expect(html).toContain("Dim workspace");
});
