import { Button, Switch, TextField } from "@codeui/kit";

export default function FocusRing() {
	return (
		<>
			<TextField size="sm" label="Snippet name" placeholder="Untitled" />
			<Switch label="Show line numbers" />
			<Button theme="primary" size="sm">
				Export PNG
			</Button>
		</>
	);
}
