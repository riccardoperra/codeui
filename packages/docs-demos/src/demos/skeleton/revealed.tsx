import { Button, Skeleton, Stack } from "@codeui/kit";
import { createSignal } from "solid-js";

export default function Demo() {
	const [loading, setLoading] = createSignal(true);
	return (
		<Stack gap="3">
			<Button variant="secondary" onClick={() => setLoading(!loading())}>
				{loading() ? "Reveal snippet" : "Load again"}
			</Button>
			<section aria-label="Snippet title" aria-busy={loading() ? "true" : "false"}>
				<Skeleton visible={loading()}>
					<span>Gradient editor.tsx</span>
				</Skeleton>
			</section>
		</Stack>
	);
}
