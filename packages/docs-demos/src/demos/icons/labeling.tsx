import { icons, Stack, SvgIcon, Text } from "@codeui/kit";
export default function Labeling() {
	return <Stack gap="4">
		<Stack direction="row" align="center"><icons.CheckIcon size="16px" aria-hidden="true" /><Text>Export saved</Text></Stack>
		<icons.CheckIcon size="20px" role="img" aria-label="Export saved" />
		<SvgIcon size="16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" role="img" aria-label="Export area"><rect x="4" y="4" width="16" height="16" rx="2" /></SvgIcon>
	</Stack>;
}
