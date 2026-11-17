import { createSignal } from "solid-js";
import { Button, Select } from "@codeui/kit";

const formats = ["PNG", "SVG", "JPEG"];

export default function SelectFormDemo() {
	const [format, setFormat] = createSignal("PNG");
	const [submitted, setSubmitted] = createSignal<string>();
	return (
		<form
			onSubmit={event => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				setSubmitted(String(data.get("format")));
			}}
		>
			<Select
				aria-label="Export format"
				label="Export format"
				options={formats}
				value={format()}
				onChange={value => value && setFormat(value)}
			/>
			<input type="hidden" name="format" value={format()} />
			<Button theme="primary" type="submit">
				Export
			</Button>
			<p>{submitted() ? `Submitted format=${submitted()}` : "Not submitted yet."}</p>
		</form>
	);
}
