import { Button } from "@codeui/kit";
import * as P from "@codeui/kit/popover/parts";

export default function ComposeParts() {
	return (
		<P.Root placement="bottom-start">
			<P.Trigger as={Button} theme="secondary">
				Line height
			</P.Trigger>
			<P.Portal>
				<P.Content>
					<div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
						<P.Title>Line height</P.Title>
						<P.CloseButton aria-label="Close line height" />
					</div>
					<P.Description>Space between lines of code.</P.Description>
					<div style={{ display: "flex", gap: "8px" }}>
						<Button theme="secondary" size="sm">
							1.2
						</Button>
						<Button theme="secondary" size="sm">
							1.5
						</Button>
						<Button theme="secondary" size="sm">
							1.8
						</Button>
					</div>
				</P.Content>
			</P.Portal>
		</P.Root>
	);
}
