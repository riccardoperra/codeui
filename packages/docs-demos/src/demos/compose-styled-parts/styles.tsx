import { Popover } from "@kobalte/core/popover";
import { buttonStyles } from "@codeui/kit";
import { popoverParts, popoverStyles } from "@codeui/kit/popover";

export default function ComposeStyles() {
	return (
		<Popover placement="bottom-start" gutter={6}>
			<Popover.Trigger class={buttonStyles.button({ theme: "secondary", size: "md" })}>Line height</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content data-cui={popoverParts.content} class={popoverStyles.content({ variant: "bordered" })}>
					<Popover.Title data-cui={popoverParts.title} class={popoverStyles.title()}>
						Line height
					</Popover.Title>
					<Popover.Description data-cui={popoverParts.description} class={popoverStyles.description()}>
						Kobalte renders the panel. The kit only supplies the classes.
					</Popover.Description>
				</Popover.Content>
			</Popover.Portal>
		</Popover>
	);
}
