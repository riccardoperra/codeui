import { createSignal } from "solid-js";
import { Button, Combobox } from "@codeui/kit";

const languages = ["TypeScript", "JavaScript", "Rust", "Python", "Go"];

export default function ComboboxFormDemo() {
	const [submitted, setSubmitted] = createSignal<string>();
	return (
		<form
			onSubmit={event => {
				event.preventDefault();
				const data = new FormData(event.currentTarget);
				setSubmitted(String(data.get("language") ?? ""));
			}}
		>
			<Combobox label="Language" name="language" required options={languages} />
			<Button theme="primary" type="submit">
				Save snippet
			</Button>
			<p>{submitted() === undefined ? "Not submitted yet." : `Submitted language=${submitted()}`}</p>
		</form>
	);
}
