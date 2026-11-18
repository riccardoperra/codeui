import { createSignal } from "solid-js";
import { Button, Select } from "@codeui/kit";

const formats = ["PNG", "SVG", "JPEG"];

export default function SelectFormDemo() {
	const [submitted, setSubmitted] = createSignal<string>();
	return (
		<form
			onSubmit={event => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				setSubmitted(String(data.get("format")));
			}}
		>
			<Select label="Export format" name="format" options={formats} defaultValue="PNG" />
			<Button variant="primary" type="submit">
				Export
			</Button>
			<p>{submitted() ? `Submitted format=${submitted()}` : "Not submitted yet."}</p>
		</form>
	);
}
