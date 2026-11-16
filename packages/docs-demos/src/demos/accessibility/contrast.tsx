import { Button } from "@codeui/kit";

export default function Contrast() {
	return (
		<>
			{/* White on #09f is 3.0:1. It passes for 18px+ text, not for 14px labels. */}
			<Button theme="primary">Export PNG</Button>
			{/* White on #c53030 is 5.5:1. */}
			<Button theme="negative">Delete snippet</Button>
			<Button theme="secondary">Copy snippet</Button>
		</>
	);
}
