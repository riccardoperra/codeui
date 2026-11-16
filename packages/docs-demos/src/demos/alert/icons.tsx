import { Alert, icons, Stack } from "@codeui/kit";

export default function Demo() {
	return (
		<Stack gap="3">
			<Alert tone="info" showIcon>
				PNG export is available.
			</Alert>
			<Alert tone="info" showIcon={false}>
				PNG export is available.
			</Alert>
			<Alert showIcon icon={<icons.CheckIcon />}>
				Your snippet was saved.
			</Alert>
		</Stack>
	);
}
