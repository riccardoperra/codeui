import { Alert } from "@codeui/kit";

export default function Demo() {
	return (
		<Alert tone="warning" showIcon title="Unsaved snippet">
			Save your snippet before you close the editor.
		</Alert>
	);
}
