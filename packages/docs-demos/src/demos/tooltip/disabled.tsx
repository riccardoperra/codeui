import { createSignal } from "solid-js";
import { Button, Switch, Tooltip } from "@codeui/kit";

export default function TooltipDisabled() {
	const [hints, setHints] = createSignal(false);
	return (
		<>
			<Switch label="Show hints" checked={hints()} onChange={setHints} />
			<Tooltip content="Format the code with Prettier" disabled={!hints()}>
				<Button theme="secondary">Format</Button>
			</Tooltip>
		</>
	);
}
