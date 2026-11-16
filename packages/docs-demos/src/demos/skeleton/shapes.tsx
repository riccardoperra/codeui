import { Skeleton, Stack } from "@codeui/kit";

export default function Demo() {
	return (
		<section aria-label="Snippet details" aria-busy="true">
			<Stack gap="3">
				<Skeleton circle height="var(--cui-space-10)" />
				<Skeleton width="60%" height="1rem" />
				<Skeleton height="4rem" radius="var(--cui-radius-md)" />
			</Stack>
		</section>
	);
}
