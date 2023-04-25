import { Button, IconButton, themeTokens, Tooltip, tokens } from "@codeui/kit";
import { CheckIcon } from "~/components/icons/CheckIcon";
import { XmarkIcon } from "~/components/icons/XmarkIcon";
import { DemoSectionRow } from "~/components/ui/DemoSection";

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

			<DemoSectionRow>
				<Tooltip content={"tooltip"} theme="primary" placement="bottom">
					<Button theme="primary">primary</Button>
				</Tooltip>
				<Tooltip content={"tooltip"} theme="secondary" placement="top">
					<Button theme="secondary">secondary</Button>
				</Tooltip>
				<Tooltip content={"tooltip"} theme="secondary" placement="top" disabled>
					<Button theme="secondary" disabled>
						Disabled
					</Button>
				</Tooltip>
			</DemoSectionRow>

			<h2>Custom components</h2>

			<DemoSectionRow>
				<Tooltip content={<ConfirmPanel />} theme="primary" placement="bottom">
					<span
						style={{
							display: "flex",
							"align-items": "center",
							"justify-content": "center",
							"border-radius": "50%",
							width: "64px",
							height: "64px",
							"background-color": "red",
						}}
					>
						Hover
					</span>
				</Tooltip>
				<Tooltip content={<ConfirmPanel />} placement="right" theme={"secondary"}>
					<Button theme="secondary">Custom component content (right)</Button>
				</Tooltip>
			</DemoSectionRow>
		</div>
	);
}
