import { Alert } from "../src/components/Alert/Alert";
import { createToaster, Toaster } from "../src/components/Toast/Toaster";
import * as T from "../src/parts/toast";
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

it("server-renders an alert with its message", () => {
	const html = renderToString(() => (
		<Alert title="Offline">Changes are saved locally.</Alert>
	));
	expect(html).toMatch(/role="alert"/);
	expect(html).toContain("Changes are saved locally.");
});

it("server-renders an empty toast region", () => {
	const html = renderToString(() => (
		<T.Region>
			<T.List />
		</T.Region>
	));
	expect(html).toMatch(/<div[^>]*role="region"/);
	expect(html).toMatch(/<div[^>]*data-cui="toast-list"[^>]*><\/div>/);
});

it("server-renders an empty toaster and keeps shown toasts off the shared engine", () => {
	const firstRequest = createToaster();
	expect(firstRequest.show({ description: "First request" })).toBe(1);
	const html = renderToString(() => (
		<Toaster toaster={firstRequest} closeLabel="Close" aria-label="Notifications" />
	));
	expect(html).toMatch(/role="region"/);
	expect(html).not.toContain("First request");

	const secondRequest = createToaster();
	const secondHtml = renderToString(() => (
		<Toaster toaster={secondRequest} closeLabel="Close" aria-label="Notifications" />
	));
	expect(secondHtml).not.toContain("First request");
});
