import { Button, Link } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)", "align-items": "center" }}>
			<Button theme="primary">Export PNG</Button>
			<Button theme="secondary">Copy snippet</Button>
			<Link href="https://codeimage.dev" variant="underline">Open CodeImage</Link>
		</div>
	);
}
