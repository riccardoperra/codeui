import { Link } from "@codeui/kit";

export default function LinkDemo() {
	return (
		<>
			<Link href="https://codeimage.dev" target="_blank">
				Open CodeImage
			</Link>
			<Link href="https://github.com/riccardoperra/codeui" target="_blank" variant="underline">
				View source
			</Link>
			<Link href="#" disabled>
				Export history
			</Link>
		</>
	);
}
