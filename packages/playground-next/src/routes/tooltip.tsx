import { Button, Tooltip } from "@codeui/kit";

export default function TooltipDemo() {
	return (
		<div style={{ "min-height": "300px" }}>
			<h1 class={"title"}>Tooltip</h1>
			<Tooltip content={"tooltip"} theme="primary" placement="bottom">
				<Button theme="primary">primary</Button>
			</Tooltip>
			<Tooltip content={"tooltip"} theme="secondary" placement="top">
				<Button theme="secondary">secondary</Button>
			</Tooltip>
		</div>
	);
}
