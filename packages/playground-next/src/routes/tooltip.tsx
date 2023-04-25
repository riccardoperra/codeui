import { Button, IconButton, Tooltip } from "@codeui/kit";
import { CheckIcon } from "~/components/icons/CheckIcon";
import { XmarkIcon } from "~/components/icons/XmarkIcon";
function ConfirmPanel() {
	return (
		<div
			style={{
				display: "flex",
				"align-items": "center",
				"justify-content": "center",
				gap: "0.7rem",
			}}
		>
			<IconButton aria-label="Confirm" size={"sm"} theme={"primary"}>
				<CheckIcon />
			</IconButton>
			<IconButton aria-label="Search" size={"sm"} theme={"negative"}>
				<XmarkIcon />
			</IconButton>
		</div>
	);
}

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
			<Tooltip content={"tooltip"} theme="secondary" placement="top" disabled>
				<Button theme="secondary" disabled>
					not tooltip
				</Button>
			</Tooltip>

			<hr />
			<Tooltip content={<ConfirmPanel />} theme="primary" placement="bottom">
				<Button theme="primary">with component </Button>
			</Tooltip>
			<Tooltip content={<ConfirmPanel />} placement="right">
				<Button theme="secondary">with component </Button>
			</Tooltip>
		</div>
	);
}
