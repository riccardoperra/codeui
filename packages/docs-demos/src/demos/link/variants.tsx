import { Link } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)", "align-items": "center" }}>
			<Link href="https://codeimage.dev">Open CodeImage</Link>
			<Link href="https://codeimage.dev" variant="underline">Open CodeImage with hover underline</Link>
		</div>
	);
}
