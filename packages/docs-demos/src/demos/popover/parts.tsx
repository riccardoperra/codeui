import { Button } from "@codeui/kit";
import * as P from "@codeui/kit/popover/parts";

export default function PopoverParts() {
	return (
		<P.Root placement="bottom-start" gutter={10}>
			<P.Trigger as={Button} variant="secondary">
				What's new
			</P.Trigger>
			<P.Portal>
				<P.Content variant="bordered">
					<P.Arrow />
					<div style={{ display: "flex", "align-items": "center", "justify-content": "space-between" }}>
						<P.Title>New export panel</P.Title>
						<P.CloseButton aria-label="Close what's new" />
					</div>
					<P.Description>Export styles now live next to the preview.</P.Description>
				</P.Content>
			</P.Portal>
		</P.Root>
	);
}
