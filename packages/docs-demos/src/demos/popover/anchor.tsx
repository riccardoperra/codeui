import { Button } from "@codeui/kit";
import * as P from "@codeui/kit/popover/parts";

export default function PopoverAnchor() {
	return (
		<P.Root placement="bottom-start">
			<P.Anchor
				style={{
					display: "flex",
					gap: "12px",
					"align-items": "center",
					padding: "8px 8px 8px 16px",
					"border-radius": "var(--cui-radius-md)",
					background: "var(--cui-surface-input)",
				}}
			>
				<span>Background</span>
				<P.Trigger as={Button} variant="secondary" size="sm">
					#1d1d1d
				</P.Trigger>
			</P.Anchor>
			<P.Portal>
				<P.Content>
					<P.Title>Background</P.Title>
					<P.Description>The panel lines up with the row, not with the button.</P.Description>
				</P.Content>
			</P.Portal>
		</P.Root>
	);
}
