import { Button } from "@codeui/kit";
import * as P from "@codeui/kit/popover/parts";

/** Open, with the panel rendered inline instead of in a portal. */
export default function PopoverAnatomy() {
	return (
		<P.Root open placement="bottom-start">
			<div style={{ display: "grid", gap: "var(--cui-space-2)", "justify-items": "start" }}>
				<P.Anchor style={{ display: "flex", gap: "var(--cui-space-2)" }}>
					<P.Trigger as={Button} theme="secondary">
						Font settings
					</P.Trigger>
				</P.Anchor>
				<P.Content>
					<P.Arrow />
					<P.CloseButton aria-label="Close font settings" />
					<P.Title>Font settings</P.Title>
					<P.Description>Applies to every new snippet.</P.Description>
				</P.Content>
			</div>
		</P.Root>
	);
}
