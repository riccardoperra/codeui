import { Button } from "@codeui/kit";

export default function ButtonDemo() {
	return (
		<>
			<Button variant="primary">Export</Button>
			<Button variant="secondary">Copy link</Button>
			<Button variant="secondary" ghost>
				Reset theme
			</Button>
			<Button variant="primary" loading>
				Exporting
			</Button>
		</>
	);
}
