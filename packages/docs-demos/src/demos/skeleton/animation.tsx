import { Skeleton, Stack } from "@codeui/kit";

export default function Demo() {
	return (
		<section aria-label="Snippet previews" aria-busy="true">
			<Stack gap="3">
				<Skeleton animate height="2rem" />
				<Skeleton animate={false} height="2rem" />
			</Stack>
		</section>
	);
}
