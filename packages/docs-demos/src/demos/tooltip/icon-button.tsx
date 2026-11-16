import { IconButton, icons, Tooltip } from "@codeui/kit";

export default function TooltipIconButton() {
	return (
		<div style={{ display: "flex", gap: "4px" }}>
			<Tooltip content="Previous snippet" theme="secondary">
				<IconButton theme="secondary" aria-label="Previous snippet">
					<icons.PreviousIcon />
				</IconButton>
			</Tooltip>
			<Tooltip content="Next snippet" theme="secondary">
				<IconButton theme="secondary" aria-label="Next snippet">
					<icons.NextIcon />
				</IconButton>
			</Tooltip>
		</div>
	);
}
