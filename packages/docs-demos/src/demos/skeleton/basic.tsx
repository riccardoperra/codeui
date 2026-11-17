import { Skeleton, Stack } from "@codeui/kit";

export default function Demo() {
	return (
		<section aria-label="Snippet preview" aria-busy="true">
			<Stack gap="2">
				<Skeleton width="60%" height="1rem" />
				<Skeleton height="4rem" />
			</Stack>
		</section>
	);
}
