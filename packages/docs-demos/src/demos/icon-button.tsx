import { IconButton, icons } from "@codeui/kit";

export default function IconButtonDemo() {
	return (
		<>
			<IconButton variant="secondary" aria-label="Previous snippet">
				<icons.PreviousIcon />
			</IconButton>
			<IconButton variant="secondary" aria-label="Next snippet">
				<icons.NextIcon />
			</IconButton>
			<IconButton variant="tertiary" size="sm" aria-label="Close panel">
				<icons.CloseIcon />
			</IconButton>
		</>
	);
}
