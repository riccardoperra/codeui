import { Alert, Button } from "@codeui/kit";

export default function AlertAnatomy() {
	return (
		<Alert
			tone="info"
			showIcon
			title="Export ready"
			description="snippet.png is 1280 × 720."
			action={<Button variant="secondary">Open</Button>}
		/>
	);
}
