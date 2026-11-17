import { Button } from "@codeui/kit";

export default function ButtonDemo() {
	return (
		<>
			<Button theme="primary">Export</Button>
			<Button theme="secondary">Copy link</Button>
			<Button theme="secondary" variant="ghost">
				Reset theme
			</Button>
			<Button theme="primary" loading>
				Exporting
			</Button>
		</>
	);
}
