import { Button } from "@codeui/kit";
import * as P from "@codeui/kit/popover";

export default function PopoverPartsDemo() {
	return (
		<P.Root placement="bottom-start">
			<P.Trigger as={Button} theme="secondary">
				What's new
			</P.Trigger>
			<P.Portal>
				<P.Content variant="bordered">
					<P.Arrow />
					<P.Title>New export panel</P.Title>
					<P.Description>Export styles now live next to the preview.</P.Description>
					<P.CloseButton />
				</P.Content>
			</P.Portal>
		</P.Root>
	);
}
