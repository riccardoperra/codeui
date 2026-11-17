import { IconButton, icons } from "@codeui/kit";

export default function IconButtonDemo() {
	return (
		<>
			<IconButton theme="secondary" aria-label="Previous snippet">
				<icons.PreviousIcon />
			</IconButton>
			<IconButton theme="secondary" aria-label="Next snippet">
				<icons.NextIcon />
			</IconButton>
			<IconButton theme="tertiary" size="sm" aria-label="Close panel">
				<icons.CloseIcon />
			</IconButton>
		</>
	);
}
