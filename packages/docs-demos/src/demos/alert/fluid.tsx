import { Alert, Stack } from "@codeui/kit";

export default function Demo() {
	return (
		<Stack gap="3">
			<div>
				<Alert fluid={false}>Unsaved snippet</Alert>
			</div>
			<Alert fluid>Unsaved snippet</Alert>
		</Stack>
	);
}
