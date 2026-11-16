import { Progress, Stack } from "@codeui/kit";

export default function Demo() {
	return (
		<Stack gap="3">
			<Progress label="PNG export" size="sm" value={40} showValue />
			<Progress label="Video export" size="md" value={60} showValue />
		</Stack>
	);
}
