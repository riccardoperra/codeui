import { Button, Switch } from "@codeui/kit";
import { createSignal } from "solid-js";
import "./editor-toolbar.css";

export default function EditorToolbar() {
	const [lineNumbers, setLineNumbers] = createSignal(true);
	const [savedLineNumbers, setSavedLineNumbers] = createSignal(true);

	return (
		<div class="editor-toolbar" role="group" aria-label="Editor preferences">
			<Switch
				class="editor-toolbar__line-numbers"
				label="Show line numbers"
				checked={lineNumbers()}
				onChange={setLineNumbers}
			/>
			<Button variant="ghost" onClick={() => setLineNumbers(true)}>
				Reset
			</Button>
			<Button
				class="editor-toolbar__save"
				theme="primary"
				onClick={() => setSavedLineNumbers(lineNumbers())}
			>
				Save
			</Button>
			<p class="editor-toolbar__status" role="status">
				{lineNumbers() === savedLineNumbers() ? "No unsaved changes." : "Unsaved changes."}
			</p>
		</div>
	);
}
