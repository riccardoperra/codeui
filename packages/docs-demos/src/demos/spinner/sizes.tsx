import { Spinner, Stack } from "@codeui/kit";

export default function Demo() {
	return (
		<Stack direction="row" gap="3">
			<Spinner size="sm" label="Loading thumbnail" />
			<Spinner size="md" label="Loading snippet" />
			<Spinner size="lg" label="Loading library" />
		</Stack>
	);
}
