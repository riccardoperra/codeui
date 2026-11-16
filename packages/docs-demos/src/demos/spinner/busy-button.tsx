import { Button, Spinner } from "@codeui/kit";

export default function Demo() {
	return (
		<Button theme="secondary" aria-busy="true" disabled leftIcon={<Spinner size="sm" />}>
			Exporting PNG
		</Button>
	);
}
