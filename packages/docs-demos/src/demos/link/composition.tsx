import { Link } from "@codeui/kit";

export default function Demo() {
	return (
		<div style={{ display: "flex", "flex-wrap": "wrap", gap: "var(--cui-space-3)", "align-items": "center" }}>
			<Link as="a" href="https://github.com/riccardoperra/codeui" target="_blank" rel="noopener noreferrer" variant="underline">View source in a new tab</Link>
		</div>
	);
}
