import { Alert, Stack } from "@codeui/kit";

export default function Demo() {
	return (
		<Stack gap="3">
			<Alert tone="neutral" showIcon fluid>
				Your snippet stays on this device.
			</Alert>
			<Alert tone="info" showIcon fluid>
				PNG export supports transparent backgrounds.
			</Alert>
			<Alert tone="success" showIcon fluid>
				Your snippet was saved.
			</Alert>
			<Alert tone="warning" showIcon fluid>
				Your snippet has unsaved changes.
			</Alert>
			<Alert tone="danger" showIcon fluid>
				Export failed. Check your connection and retry.
			</Alert>
		</Stack>
	);
}
