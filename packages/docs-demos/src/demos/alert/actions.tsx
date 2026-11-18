import { Alert, Button } from "@codeui/kit";
import { createSignal } from "solid-js";

export default function Demo() {
	const [saved, setSaved] = createSignal(false);
	return (
		<Alert
			tone="info"
			showIcon
			fluid
			title={
				<span>
					Export <code>snippet.png</code>
				</span>
			}
			description={
				<span>
					{saved() ? (
						"Export settings saved."
					) : (
						<>
							Keep the background <strong>transparent</strong>.
						</>
					)}
				</span>
			}
			action={
				<Button variant="secondary" onClick={() => setSaved(true)}>
					Save settings
				</Button>
			}
		/>
	);
}
